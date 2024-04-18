namespace DbToolApi.Models;

public class FKDetails
{
    public string ReferenceTableName { get; set; }
    public string ReferenceColumnName { get; set; }
}

public class ColumnDetails
{
    public string DataType { get; set; }
    public bool IsPK { get; set; }
    public bool IsIdentity { get; set; }
    public bool IsGeneratedAlwaysType { get; set; }
    public bool IsNullable { get; set; }
    public FKDetails FKDetails { get; set; }
}

public class TableDetails
{
    public Dictionary<string, ColumnDetails> Columns { get; set; }
    public List<Dictionary<string, object>> Rows { get; set; } = [];
}
