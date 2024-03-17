using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Api.Models;
using System.Data;
using System.Linq;
using Dapper;
using System.Data.Common;
using System.Collections.Generic;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseController() : ControllerBase
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

            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            var tables = await GetTables(connection);
            tables = await GetPrimaryKeys(connection, tables);
            tables = await GetForeignKeys(connection, tables);
            tables = await GetAllData(connection, tables);
            tables = DoSearch(searchQuery, tables);

            return Ok(tables);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    private static async Task<Dictionary<string, TableDetails>> GetTables(SqlConnection connection)
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

    private static async Task<Dictionary<string, TableDetails>> GetPrimaryKeys(SqlConnection connection, Dictionary<string, TableDetails> tables)
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

        var pkData = await connection.QueryAsync(query);

        foreach (var row in pkData)
        {
            tables[row.FullTableName].Columns[row.ColumnName].IsPK = true;
        }

        return tables;
    }

    private static async Task<Dictionary<string, TableDetails>> GetForeignKeys(SqlConnection connection, Dictionary<string, TableDetails> tables)
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

    public static async Task<Dictionary<string, TableDetails>> GetAllData(SqlConnection connection, Dictionary<string, TableDetails> tables)
    {
        foreach (KeyValuePair<string, TableDetails> table in tables)
        {
            table.Value.Rows = [];

            //Jos yritetään hakea dataa, jonka tyyppi on geometry, tulee exception. Skipataan toistaiseksi tämmöiset taulut
            if (table.Key == "Kohde.KohdeSijainti" || table.Key == "Kohde.OsioSijainti" || table.Key == "Kohde.PisteSijainti")
            {
                continue;
            }

            string query = $"SELECT * FROM {table.Key}";

            var rows = await connection.QueryAsync(query);

            foreach (var row in rows)
            {
                var rowDictionary = new Dictionary<string, object>();

                foreach (var prop in row as IDictionary<string, object>)
                {
                    rowDictionary.Add(prop.Key, prop.Value);
                }

                table.Value.Rows.Add(rowDictionary);
            }
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

