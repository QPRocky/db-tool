namespace Api.Models;

public class FKDetails
{
    public string ReferenceTableName { get; set; }
    public string ReferenceColumnName { get; set; }
}

public class ColumnDetails
{
    public string DataType { get; set; }
    public bool IsPK { get; set; }
    public FKDetails FKDetails { get; set; }
}

public class TableDetails
{
    public Dictionary<string, ColumnDetails> ColumnDetails { get; set; }
}
