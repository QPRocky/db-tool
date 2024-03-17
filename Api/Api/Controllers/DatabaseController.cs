using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Api.Models;
using System.Data;
using System.Linq;
using Dapper;
using System.Data.Common;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseController() : ControllerBase
{
    private string _connectionString;

    [HttpGet("TestConnection")]
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            GetConnectionStringFromHeader(Request);

            using var connection = new SqlConnection(_connectionString);
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
            GetConnectionStringFromHeader(Request);

            var tables = await GetTables();
            tables = await GetPrimaryKeys(tables);
            tables = await GetForeignKeys(tables);

            var DataType = tables["Kohde.Kohde"].ColumnDetails["Kohde_ID"].DataType;
            var IsPK = tables["Kohde.Kohde"].ColumnDetails["Kohde_ID"].IsPK;
            var FKDetails = tables["Kohde.Kohde"].ColumnDetails["Kohde_ID"].FKDetails;

            var DataType1 = tables["Kohde.Osio"].ColumnDetails["Kohde_ID"].DataType;
            var IsPK1 = tables["Kohde.Osio"].ColumnDetails["Kohde_ID"].IsPK;
            var FKDetails1 = tables["Kohde.Osio"].ColumnDetails["Kohde_ID"].FKDetails;

            return Ok(tables);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    private async Task<Dictionary<string, TableDetails>> GetTables()
    {
        var tables = new Dictionary<string, TableDetails>();

        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

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
                    ColumnDetails = []
                };
            }

            tables[fullTableName].ColumnDetails.Add(row.ColumnName, new ColumnDetails
            {
                DataType = row.DataType,
                FKDetails = null
            });
        }

        return tables;
    }

    private async Task<Dictionary<string, TableDetails>> GetPrimaryKeys(Dictionary<string, TableDetails> tables)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        string pkQuery = @"
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

        var pkData = await connection.QueryAsync(pkQuery);

        foreach (var row in pkData)
        {
            tables[row.FullTableName].ColumnDetails[row.ColumnName].IsPK = true;
        }

        return tables;
    }

    private async Task<Dictionary<string, TableDetails>> GetForeignKeys(Dictionary<string, TableDetails> tables)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        string fkQuery = @"
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

        var fkData = await connection.QueryAsync(fkQuery);

        foreach (var row in fkData)
        {
            if (tables.ContainsKey(row.ParentTableName))
            {
                tables[row.ParentTableName].ColumnDetails[row.ParentColumnName].FKDetails = new FKDetails
                {
                    ReferenceTableName = row.ReferenceTableName,
                    ReferenceColumnName = row.ReferenceColumnName
                };
            }
        }

        return tables;
    }

    private void GetConnectionStringFromHeader(HttpRequest request)
    {
        if (!request.Headers.TryGetValue("ConnectionString", out var connectionString))
        {
            throw new Exception("Missing connectionString header");
        }

        _connectionString = connectionString.ToString();
    }
}