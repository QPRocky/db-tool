using Dapper;
using DbToolApi.Dtos;
using DbToolApi.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Data.SqlClient;
using System.Text.Json;
using System.Threading.Channels;
using System.Xml;

namespace DbToolApi.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseController : ControllerBase
{
    private static Dictionary<string, TrackingTableDetails> trackingStart;
    private static Dictionary<string, TrackingTableDetails> trackingStop;

    [HttpGet("TestConnection")]
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            var connectionString = GetConnectionStringFromHeader(Request);

            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();
            await connection.QuerySingleAsync<int>("SELECT 1");

            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string searchQuery)
    {
        try
        {
            var connectionString = GetConnectionStringFromHeader(Request);

            var tables = await GetTables(connectionString);
            tables = await GetPrimaryKeys(connectionString, tables);
            tables = await GetForeignKeys(connectionString, tables);
            tables = await GetAllData(connectionString, tables);
            tables = DoSearch(searchQuery, tables);

            return Ok(tables);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpPost("SearchByPrimaryKey")]
    public async Task<IActionResult> SearchByPrimaryKey(PrimaryKeySearchDetails dto)
    {
        try
        {
            var connectionString = GetConnectionStringFromHeader(Request);

            var tables = await GetTables(connectionString);
            tables = await GetPrimaryKeys(connectionString, tables);
            tables = await GetForeignKeys(connectionString, tables);
            tables = FilterTablesByTableNameAndColumnName(tables, dto.TableName, dto.ColumnName);
            tables = await GetAllDataByPrimaryKey(connectionString, tables, dto.ColumnName, dto.PrimaryKey);

            return Ok(tables);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpPost("SearchByForeignKey")]
    public async Task<IActionResult> SearchByForeignKey(ForeignKeySearchDetails dto)
    {
        try
        {
            var connectionString = GetConnectionStringFromHeader(Request);

            var tables = await GetTableByName(connectionString, dto.ReferenceTableName);
            tables = await GetPrimaryKeys(connectionString, tables);
            tables = await GetForeignKeys(connectionString, tables);
            tables = await GetAllDataByKey(connectionString, tables, dto.ReferenceColumnName, dto.ForeignKey);

            return Ok(tables);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpPost("SaveColumn")]
    public async Task<IActionResult> SaveColumn(SaveColumnDetails dto)
    {
        try
        {
            var connectionString = GetConnectionStringFromHeader(Request);

            await EditColumn(connectionString, dto);

            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpPost("AddRow")]
    public async Task<IActionResult> AddRow(AddRowRequest dto)
    {
        try
        {
            var connectionString = GetConnectionStringFromHeader(Request);

            await AddRow(connectionString, dto);

            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpDelete("DeleteRow")]
    public async Task<IActionResult> DeleteRow(RemoveRowDetails dto)
    {
        try
        {
            var connectionString = GetConnectionStringFromHeader(Request);

            await DeleteRow(connectionString, dto);

            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpPut("Tracking")]
    public async Task<IActionResult> Tracking(string state)
    {
        try
        {
            var connectionString = GetConnectionStringFromHeader(Request);

            var tables = await GetTables(connectionString);
            tables = await GetPrimaryKeys(connectionString, tables);
            tables = await GetAllData(connectionString, tables);

            var changes = new ChangeResults();

            if (state == "start")
            {
                trackingStart = CreateTrackingDetails(tables);
            }
            else if (state == "stop")
            {
                trackingStop = CreateTrackingDetails(tables);
                changes = CompareTrackingDetails(trackingStart, trackingStop);
            }

            return Ok(changes);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    private static ChangeResults CompareTrackingDetails(Dictionary<string, TrackingTableDetails> trackingFirst, Dictionary<string, TrackingTableDetails> trackingSecond)
    {
        var results = new ChangeResults();

        foreach (var tableName in trackingFirst.Keys.Union(trackingSecond.Keys))
        {
            var insertedRows = new ChangeRowDetails { Rows = [] };
            var updatedRows = new ChangeRowDetails { Rows = [] };
            var deletedRows = new ChangeRowDetails { Rows = [] };

            var firstRows = trackingFirst.ContainsKey(tableName) ? trackingFirst[tableName].Rows : [];
            var secondRows = trackingSecond.ContainsKey(tableName) ? trackingSecond[tableName].Rows : [];

            var firstKeys = firstRows.SelectMany(dict => dict.Keys).ToHashSet();
            var secondKeys = secondRows.SelectMany(dict => dict.Keys).ToHashSet();

            foreach (var key in firstKeys.Except(secondKeys))
            {
                var row = firstRows.FirstOrDefault(r => r.ContainsKey(key));
                if (row != null)
                    deletedRows.Rows.Add(row[key]);
            }

            foreach (var key in secondKeys.Except(firstKeys))
            {
                var row = secondRows.FirstOrDefault(r => r.ContainsKey(key));
                if (row != null)
                    insertedRows.Rows.Add(row[key]);
            }

            foreach (var key in firstKeys.Intersect(secondKeys))
            {
                var firstRow = firstRows.FirstOrDefault(r => r.ContainsKey(key));
                var secondRow = secondRows.FirstOrDefault(r => r.ContainsKey(key));

                if (firstRow[key] != secondRow[key])
                {
                    updatedRows.Rows.Add(firstRow[key]);
                    updatedRows.Rows.Add(secondRow[key]);
                }
            }

            if (insertedRows.Rows.Count > 0)
                results.Inserted.Add(tableName, insertedRows);
            if (deletedRows.Rows.Count > 0)
                results.Deleted.Add(tableName, deletedRows);
            if (updatedRows.Rows.Count > 0)
                results.Updated.Add(tableName, updatedRows);
        }

        return results;
    }

    private static Dictionary<string, TrackingTableDetails> CreateTrackingDetails(Dictionary<string, TableDetails> tables)
    {
        var result = new Dictionary<string, TrackingTableDetails>();

        foreach (var tableEntry in tables)
        {
            var tableName = tableEntry.Key;
            var tableDetails = tableEntry.Value;

            var pkColumns = tableDetails.Columns
                .Where(c => c.Value.IsPK)
                .Select(c => c.Key)
                .ToList();

            if (pkColumns.Count == 0)
                continue;

            var trackingDetails = new TrackingTableDetails();

            foreach (var row in tableDetails.Rows)
            {
                var pkValue = string.Join("", pkColumns.Select(pk => row[pk]?.ToString() ?? ""));
                var serializedRow = JsonConvert.SerializeObject(row, Newtonsoft.Json.Formatting.None);
                trackingDetails.Rows.Add(new Dictionary<string, string> { { pkValue, serializedRow } });
            }

            result.Add(tableName, trackingDetails);
        }

        return result;
    }

    private static async Task DeleteRow(string connectionString, RemoveRowDetails dto)
    {
        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        var primaryKeyValues = new Dictionary<string, object>();

        foreach (var pk in dto.primaryKeyColumnNamesAndValues)
        {
            var value = ConvertJsonElementToObject((JsonElement)pk.Value);
            primaryKeyValues.Add(pk.ColumnName, value);
        }

        var whereClause = string.Join(" AND ", primaryKeyValues.Select(kvp => $"{kvp.Key} = @{kvp.Key}"));

        var sql = $"DELETE FROM {dto.TableName} WHERE {whereClause}";

        var parameters = new DynamicParameters();

        foreach (var kvp in primaryKeyValues)
        {
            parameters.Add(kvp.Key, kvp.Value);
        }

        var affectedRows = await connection.ExecuteAsync(sql, parameters);
    }

    private static async Task EditColumn(string connectionString, SaveColumnDetails dto)
    {
        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        object value = null;

        if (dto.Value != null)
        {
            value = ConvertJsonElementToObject((JsonElement)dto.Value);
        }

        var primaryKeyValues = new Dictionary<string, object>();

        foreach (var pk in dto.primaryKeyColumnNamesAndValues)
        {
            var pkValue = ConvertJsonElementToObject((JsonElement)pk.Value);
            primaryKeyValues.Add(pk.ColumnName, pkValue);
        }

        var whereClause = string.Join(" AND ", primaryKeyValues.Select(kvp => $"{kvp.Key} = @{kvp.Key}"));

        var sql = $"UPDATE {dto.TableName} SET {dto.ColumnName} = @Value WHERE {whereClause}";

        var parameters = new DynamicParameters();
        parameters.Add("Value", value);

        foreach (var kvp in primaryKeyValues)
        {
            parameters.Add(kvp.Key, kvp.Value);
        }

        var affectedRows = await connection.ExecuteAsync(sql, parameters);
    }

    private static async Task AddRow(string connectionString, AddRowRequest dto)
    {
        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        var columnNames = string.Join(", ", dto.Columns.Select(c => c.ColumnName));
        var columnValues = string.Join(", ", dto.Columns.Select(c => $"@{c.ColumnName}"));

        var sql = $"INSERT INTO {dto.TableName} ({columnNames}) VALUES ({columnValues})";

        var parameters = new DynamicParameters();

        foreach (var column in dto.Columns)
        {
            var value = column.ColumnValue != null ? ConvertJsonElementToObject((JsonElement)column.ColumnValue) : null;
            parameters.Add(column.ColumnName, value);
        }

        var affectedRows = await connection.ExecuteAsync(sql, parameters);
    }

    private static object ConvertJsonElementToObject(JsonElement element)
    {
        switch (element.ValueKind)
        {
            case JsonValueKind.True:
            case JsonValueKind.False:
                return element.GetBoolean();

            case JsonValueKind.String:
                return element.GetString();

            case JsonValueKind.Number:
                if (element.TryGetInt32(out int intValue))
                {
                    return intValue;
                }
                if (element.TryGetInt64(out long longValue))
                {
                    return longValue;
                }
                return element.GetDouble();

            default:
                throw new NotSupportedException($"Unsupported JsonValueKind: {element.ValueKind}");
        }
    }

    private static async Task<Dictionary<string, TableDetails>> GetTables(string connectionString)
    {
        var tables = new Dictionary<string, TableDetails>();

        string query = @"
                SELECT 
                    SCHEMA_NAME(t.schema_id) + '.' + t.name AS FullTableName,
                    c.NAME AS ColumnName,
                    TYPE_NAME(c.user_type_id) AS DataType,
                    CASE 
                        WHEN c.generated_always_type IN (1, 2) THEN 1
                        ELSE 0
                    END AS IsGeneratedAlwaysType,
                    c.is_nullable AS IsNullable
                FROM 
                    sys.tables AS t
                INNER JOIN 
                    sys.columns AS c ON t.object_id = c.object_id
                WHERE 
                    t.type = 'U'  
                ORDER BY 
                    SCHEMA_NAME(t.schema_id), 
                    t.name, 
                    c.column_id";

        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        var columnData = await connection.QueryAsync(query);

        foreach (var row in columnData)
        {
            var fullTableName = row.FullTableName;
            if (!tables.ContainsKey(fullTableName))
            {
                tables[fullTableName] = new TableDetails
                {
                    Columns = []
                };
            }

            tables[fullTableName].Columns.Add(row.ColumnName, new ColumnDetails
            {
                DataType = row.DataType,
                FKDetails = null,
                IsGeneratedAlwaysType = row.IsGeneratedAlwaysType == 1,
                IsNullable = row.IsNullable
            });
        }

        return tables;
    }

    private static async Task<Dictionary<string, TableDetails>> GetTableByName(string connectionString, string tableName)
    {
        var tables = new Dictionary<string, TableDetails>();
        var tableNameParts = tableName.Split('.');

        string query = @"
                SELECT 
                    t.TABLE_SCHEMA + '.' + t.TABLE_NAME as FullTableName,
                    c.COLUMN_NAME as ColumnName, 
                    c.DATA_TYPE as DataType 
                FROM 
                    INFORMATION_SCHEMA.COLUMNS c
                INNER JOIN 
                    INFORMATION_SCHEMA.TABLES t ON c.TABLE_NAME = t.TABLE_NAME AND c.TABLE_SCHEMA = t.TABLE_SCHEMA
                WHERE 
                    t.TABLE_TYPE = 'BASE TABLE' AND 
                    t.TABLE_SCHEMA = @Schema AND 
                    t.TABLE_NAME = @TableName
                ORDER BY 
                    c.TABLE_SCHEMA, 
                    c.TABLE_NAME, 
                    c.ORDINAL_POSITION";

        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        var columnData = await connection.QueryAsync(query, new { Schema = tableNameParts.First(), TableName = tableNameParts.Last() });

        foreach (var row in columnData)
        {
            var fullTableName = row.FullTableName;
            if (!tables.ContainsKey(fullTableName))
            {
                tables[fullTableName] = new TableDetails
                {
                    Columns = []
                };
            }

            tables[fullTableName].Columns.Add(row.ColumnName, new ColumnDetails
            {
                DataType = row.DataType,
                FKDetails = null
            });
        }

        return tables;
    }

    private static Dictionary<string, TableDetails> FilterTablesByTableNameAndColumnName(Dictionary<string, TableDetails> tables, string tableName, string columnName)
    {
        var filteredTables = new Dictionary<string, TableDetails>();

        foreach (var table in tables)
        {
            foreach (var column in table.Value.Columns)
            {
                if (column.Value.FKDetails != null &&
                    column.Value.FKDetails.ReferenceTableName == tableName &&
                    column.Value.FKDetails.ReferenceColumnName == columnName)
                {
                    if (!filteredTables.ContainsKey(table.Key))
                    {
                        filteredTables.Add(table.Key, table.Value);
                    }
                }
            }
        }

        return filteredTables;
    }

    private static async Task<Dictionary<string, TableDetails>> GetPrimaryKeys(string connectionString, Dictionary<string, TableDetails> tables)
    {
        string query = @"
            SELECT 
                t.TABLE_SCHEMA + '.' + t.TABLE_NAME as FullTableName,
                c.COLUMN_NAME as ColumnName,
                CASE WHEN COLUMNPROPERTY(OBJECT_ID(t.TABLE_SCHEMA + '.' + t.TABLE_NAME), c.COLUMN_NAME, 'IsIdentity') = 1 THEN 1 ELSE 0 END AS IsIdentity
            FROM 
                INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
            JOIN 
                INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu ON tc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME 
            JOIN 
                INFORMATION_SCHEMA.COLUMNS c ON c.TABLE_NAME = ccu.TABLE_NAME AND c.COLUMN_NAME = ccu.COLUMN_NAME
            JOIN 
                INFORMATION_SCHEMA.TABLES t ON c.TABLE_NAME = t.TABLE_NAME AND c.TABLE_SCHEMA = t.TABLE_SCHEMA
            WHERE 
                CONSTRAINT_TYPE = 'PRIMARY KEY'";

        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        var pkData = await connection.QueryAsync(query);

        foreach (var row in pkData)
        {
            if (tables.ContainsKey(row.FullTableName))
            {
                tables[row.FullTableName].Columns[row.ColumnName].IsPK = true;
            }
            tables[row.FullTableName].Columns[row.ColumnName].IsIdentity = row.IsIdentity == 1;
        }

        return tables;
    }

    private static async Task<Dictionary<string, TableDetails>> GetForeignKeys(string connectionString, Dictionary<string, TableDetails> tables)
    {
        string query = @"
            SELECT 
                CONCAT(ts.name, '.', tp.name) AS ParentTableName,
                cp.name AS ParentColumnName,
                CONCAT(trs.name, '.', tr.name) AS ReferenceTableName,
                cr.name AS ReferenceColumnName
            FROM 
                sys.foreign_keys AS fk
            INNER JOIN 
                sys.tables AS tp ON fk.parent_object_id = tp.object_id
            INNER JOIN 
                sys.schemas AS ts ON tp.schema_id = ts.schema_id
            INNER JOIN 
                sys.tables AS tr ON fk.referenced_object_id = tr.object_id
            INNER JOIN 
                sys.schemas AS trs ON tr.schema_id = trs.schema_id
            INNER JOIN 
                sys.foreign_key_columns AS fkc ON fk.object_id = fkc.constraint_object_id
            INNER JOIN 
                sys.columns AS cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id
            INNER JOIN 
                sys.columns AS cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id
                ORDER BY ParentTableName, ParentColumnName;";

        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        var fkData = await connection.QueryAsync(query);

        foreach (var row in fkData)
        {
            if (tables.ContainsKey(row.ParentTableName))
            {
                tables[row.ParentTableName].Columns[row.ParentColumnName].FKDetails = new FKDetails
                {
                    ReferenceTableName = row.ReferenceTableName,
                    ReferenceColumnName = row.ReferenceColumnName
                };
            }
        }

        return tables;
    }

    private static async Task<Dictionary<string, TableDetails>> GetAllData(string connectionString, Dictionary<string, TableDetails> tables)
    {
        var tasks = new List<Task>();
        var tempResults = new ConcurrentDictionary<string, List<Dictionary<string, object>>>();

        foreach (var table in tables.Keys.ToList())
        {
            if (table == "Kohde.KohdeSijainti" || table == "Kohde.OsioSijainti" || table == "Kohde.PisteSijainti")
            {
                continue;
            }

            tasks.Add(Task.Run(async () =>
            {
                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();
                string query = $"SELECT * FROM {table}";
                var rows = await connection.QueryAsync(query);
                var rowList = new List<Dictionary<string, object>>();

                foreach (var row in rows)
                {
                    var rowDictionary = new Dictionary<string, object>();

                    foreach (var prop in row as IDictionary<string, object>)
                    {
                        rowDictionary.Add(prop.Key, prop.Value);
                    }

                    rowList.Add(rowDictionary);
                }

                tempResults.TryAdd(table, rowList);
            }));
        }

        await Task.WhenAll(tasks);

        foreach (var kvp in tempResults)
        {
            tables[kvp.Key].Rows = kvp.Value;
        }

        return tables;
    }

    private static async Task<Dictionary<string, TableDetails>> GetAllDataByPrimaryKey(string connectionString, Dictionary<string, TableDetails> tables, string columnName, int primaryKey)
    {
        var tasks = new List<Task>();

        var tempResults = new ConcurrentDictionary<string, List<Dictionary<string, object>>>();

        foreach (var table in tables)
        {
            if (table.Key == "Kohde.KohdeSijainti" || table.Key == "Kohde.OsioSijainti" || table.Key == "Kohde.PisteSijainti")
            {
                continue;
            }

            var referenceColumnName = "";

            foreach (var column in table.Value.Columns)
            {
                if (column.Value.FKDetails != null && column.Value.FKDetails.ReferenceColumnName == columnName)
                {
                    referenceColumnName = column.Key;
                    break;
                }
            }

            tasks.Add(Task.Run(async () =>
            {
                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();
                string query = $"SELECT * FROM {table.Key} t WHERE t.{referenceColumnName}={primaryKey}";
                var rows = await connection.QueryAsync(query);
                var rowList = new List<Dictionary<string, object>>();

                foreach (var row in rows)
                {
                    var rowDictionary = new Dictionary<string, object>();

                    foreach (var prop in row as IDictionary<string, object>)
                    {
                        rowDictionary.Add(prop.Key, prop.Value);
                    }

                    rowList.Add(rowDictionary);
                }

                tempResults.TryAdd(table.Key, rowList);
            }));
        }

        await Task.WhenAll(tasks);

        foreach (var kvp in tempResults)
        {
            tables[kvp.Key].Rows = kvp.Value;
        }

        return tables;
    }

    private static async Task<Dictionary<string, TableDetails>> GetAllDataByKey(string connectionString, Dictionary<string, TableDetails> tables, string column, int key)
    {
        var tasks = new List<Task>();

        var tempResults = new ConcurrentDictionary<string, List<Dictionary<string, object>>>();

        foreach (var table in tables.Keys.ToList())
        {
            if (table == "Kohde.KohdeSijainti" || table == "Kohde.OsioSijainti" || table == "Kohde.PisteSijainti")
            {
                continue;
            }

            tasks.Add(Task.Run(async () =>
            {
                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();
                string query = $"SELECT * FROM {table} WHERE {column}={key}";
                var rows = await connection.QueryAsync(query);
                var rowList = new List<Dictionary<string, object>>();

                foreach (var row in rows)
                {
                    var rowDictionary = new Dictionary<string, object>();

                    foreach (var prop in row as IDictionary<string, object>)
                    {
                        rowDictionary.Add(prop.Key, prop.Value);
                    }

                    rowList.Add(rowDictionary);
                }

                tempResults.TryAdd(table, rowList);
            }));
        }

        await Task.WhenAll(tasks);

        foreach (var kvp in tempResults)
        {
            tables[kvp.Key].Rows = kvp.Value;
        }

        return tables;
    }

    private static Dictionary<string, TableDetails> DoSearch(string searchQuery, Dictionary<string, TableDetails> tables)
    {
        var result = new Dictionary<string, TableDetails>();

        foreach (var table in tables)
        {
            bool shouldAddAllRows = false;

            if (table.Key.Contains(searchQuery, StringComparison.OrdinalIgnoreCase) ||
                table.Value.Columns.Any(c => c.Key.Contains(searchQuery, StringComparison.OrdinalIgnoreCase)))
            {
                shouldAddAllRows = true;
            }

            var newTableDetails = new TableDetails
            {
                Columns = table.Value.Columns,
                Rows = []
            };

            foreach (var row in table.Value.Rows)
            {
                if (shouldAddAllRows || row.Any(col => col.Value != null && col.Value.ToString().Contains(searchQuery, StringComparison.OrdinalIgnoreCase)))
                {
                    newTableDetails.Rows.Add(row);
                }
            }

            if (shouldAddAllRows || newTableDetails.Rows.Count > 0)
            {
                result.Add(table.Key, newTableDetails);
            }
        }

        return result;
    }

    private static string GetConnectionStringFromHeader(HttpRequest request)
    {
        if (!request.Headers.TryGetValue("ConnectionString", out var connectionString))
        {
            throw new Exception("Missing connectionString header");
        }

        return connectionString.ToString();
    }
}

