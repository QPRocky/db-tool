namespace DbToolApi.Dtos;

public class RemoveRowDetails
{
    public string TableName { get; set; }
    public List<PrimaryKeyColumnNameAndValue> primaryKeyColumnNamesAndValues { get; set; }
}
