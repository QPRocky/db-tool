namespace DbToolApi.Dtos;

public class NewRowColumnDetails
{
    public string ColumnName { get; set; }
    public string DataType { get; set; }
    public object ColumnValue { get; set; }
}

public class AddRowRequest
{
    public string TableName { get; set; }
    public List<NewRowColumnDetails> Columns { get; set; }
}
