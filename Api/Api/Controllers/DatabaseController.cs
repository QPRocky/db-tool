using Api.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Data.SqlClient;
using System.Diagnostics;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseController : ControllerBase
{
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

    private static async Task<Dictionary<string, TableDetails>> GetTables(string connectionString)
    {
        var tables = new Dictionary<string, TableDetails>();

        string query = @"
                SELECT 
                    t.TABLE_SCHEMA + '.' + t.TABLE_NAME as FullTableName,
                    c.TABLE_NAME as TableName, 
                    c.COLUMN_NAME as ColumnName, 
                    c.DATA_TYPE as DataType 
                FROM 
                    INFORMATION_SCHEMA.COLUMNS c
                INNER JOIN 
                    INFORMATION_SCHEMA.TABLES t ON c.TABLE_NAME = t.TABLE_NAME AND c.TABLE_SCHEMA = t.TABLE_SCHEMA
                WHERE 
                    t.TABLE_TYPE = 'BASE TABLE'
                ORDER BY 
                    c.TABLE_SCHEMA, 
                    c.TABLE_NAME, 
                    c.ORDINAL_POSITION";

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
                FKDetails = null
            });
        }

        return tables;
    }

    private static async Task<Dictionary<string, TableDetails>> GetPrimaryKeys(string connectionString, Dictionary<string, TableDetails> tables)
    {
        string query = @"
            SELECT 
                t.TABLE_SCHEMA + '.' + t.TABLE_NAME as FullTableName,
                c.COLUMN_NAME as ColumnName
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
            tables[row.FullTableName].Columns[row.ColumnName].IsPK = true;
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

