﻿namespace DbToolApi.Dtos;

public class SaveColumnDetails
{
    public string TableName { get; set; }
    public string ColumnName { get; set; }
    public object Value { get; set; }
    public List<PrimaryKeyColumnNameAndValue> primaryKeyColumnNamesAndValues { get; set; }
}
