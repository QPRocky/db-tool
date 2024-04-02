namespace Api.Dtos;

public class SaveColumnDetails
{
    public string TableName { get; set; }
    public string ColumnName { get; set; }
    public object Value { get; set; }
    public string DataType { get; set; }
}
