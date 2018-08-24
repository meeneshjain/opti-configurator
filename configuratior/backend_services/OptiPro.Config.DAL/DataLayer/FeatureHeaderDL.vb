﻿Imports System.Data.SqlClient
Imports System.Data.Common
Imports OptiPro.Config.Common
Imports OptiPro.Config.DAL
Imports System.Data
Imports System.Xml
Imports System.Xml.Serialization
Imports System.IO
Imports System.ComponentModel
Imports System.Reflection
Imports OptiPro.Config.Common.Utilites


Public Class FeatureHeaderDL
 
    'Function to Add Features to Feature Header 
    Public Shared Function AddFeatures(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String

        Dim psStatus As String
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iInsert As Integer
            Dim psIsHana As String = String.Empty
            Dim dtCheckDuplicateRecord As DataTable


            Dim psDisplayName, psFeatureDesc, psProductGroupID, psPhotoPath, psCreatedBy As String
            Dim psType, psModelTemplateItem, psItemCodeGen, psFeatureStatus, psFeatureCode As String
            Dim pdtEffectiveDate As DateTime

            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'psCompanyDBId = "DEVQAS2BRANCHING"

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'If it is HANA then it will be true rather it will false
            If pObjCompany.CompanyDBType = WMSDatabaseType.HANADatabase Then
                psIsHana = True
            Else
                psIsHana = False
            End If
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)


            'get the Display NAme 
            psDisplayName = NullToString(objDataTable.Rows(0)("DisplayName"))
            'get the Feature Description 
            psFeatureDesc = NullToString(objDataTable.Rows(0)("FeatureDesc"))
            'Get the Product Group Id 
            ' psProductGroupID = NullToString(objDataTable.Rows(0)("ProductGroupID"))
            'get Photo path as String 
            psPhotoPath = NullToString(objDataTable.Rows(0)("PicturePath"))
            'Get the User 
            psCreatedBy = NullToString(objDataTable.Rows(0)("CreatedUser"))
            'get the type
            psType = NullToString(objDataTable.Rows(0)("Type"))
            'Check whether the value of Model Temlate Item is Coming from the Ui,If There is no column then we will replace with blank
            If objDataTable.Columns.Contains("ModelTemplateItem") Then
                '  get the Model Template Item,
                psModelTemplateItem = NullToString(objDataTable.Rows(0)("ModelTemplateItem"))
            Else
                'if there is no Column then we will be Cnsider it Blank
                psModelTemplateItem = ""
            End If
            'get Item Code Generation Reference Number
            psItemCodeGen = NullToString(objDataTable.Rows(0)("ItemCodeGenerationRef"))
            'get the Status of Feature
            psFeatureStatus = NullToString(objDataTable.Rows(0)("FeatureStatus"))
            'get the Effective Date and Time 
            pdtEffectiveDate = NullToDate(objDataTable.Rows(0)("EffectiveDate"))
            'get the Feature Code 
            psFeatureCode = NullToString(objDataTable.Rows(0)("FeatureCode"))
            'Functtion to Check whether the Record is Already Present in Table 
            dtCheckDuplicateRecord = CheckDuplicateFeatureCode1(psCompanyDBId, psFeatureCode, objCmpnyInstance)
            'If the Record is Already Present in the TAble then Error MEssage will be Shown 
            If (dtCheckDuplicateRecord.Rows(0)("TOTALCOUNT") > 0) Then
                psStatus = "Record Already Exist"
                Return psStatus
            Else

                Dim pSqlParam(11) As MfgDBParameter
                'Parameter 0 consisting warehouse and it's datatype will be nvarchar
                pSqlParam(0) = New MfgDBParameter
                pSqlParam(0).ParamName = "@DISPLAYNAME"
                pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(0).Paramvalue = psDisplayName

                'Parameter 1 Consisting of Feature Description and its Type will be nvarchar
                pSqlParam(1) = New MfgDBParameter
                pSqlParam(1).ParamName = "@FEATUREDESC"
                pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(1).Paramvalue = psFeatureDesc

                'pSqlParam(2) = New MfgDBParameter
                'pSqlParam(2).ParamName = "@PRODUCTGROUPID"
                'pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
                'pSqlParam(2).Paramvalue = psProductGroupID

                pSqlParam(2) = New MfgDBParameter
                pSqlParam(2).ParamName = "@PHOTOPATH"
                pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(2).Paramvalue = psPhotoPath

                pSqlParam(3) = New MfgDBParameter
                pSqlParam(3).ParamName = "@CREATEDBY"
                pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(3).Paramvalue = psCreatedBy

                pSqlParam(4) = New MfgDBParameter
                pSqlParam(4).ParamName = "@MODIFIEDBY"
                pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(4).Paramvalue = psCreatedBy

                pSqlParam(5) = New MfgDBParameter
                pSqlParam(5).ParamName = "@TYPE"
                pSqlParam(5).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(5).Paramvalue = psType

                pSqlParam(6) = New MfgDBParameter
                pSqlParam(6).ParamName = "@MODELTEMPLATEITEM"
                pSqlParam(6).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(6).Paramvalue = psModelTemplateItem

                pSqlParam(7) = New MfgDBParameter
                pSqlParam(7).ParamName = "@ITEMCODEREFERENCE"
                pSqlParam(7).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(7).Paramvalue = psItemCodeGen

                pSqlParam(8) = New MfgDBParameter
                pSqlParam(8).ParamName = "@STATUS"
                pSqlParam(8).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(8).Paramvalue = psFeatureStatus

                If psIsHana = True Then
                    pSqlParam(9) = New MfgDBParameter
                    pSqlParam(9).ParamName = "@EFFECTIVEDATE"
                    pSqlParam(9).Dbtype = BMMDbType.HANA_TimeStamp
                    pSqlParam(9).Paramvalue = pdtEffectiveDate
                Else
                    pSqlParam(9) = New MfgDBParameter
                    pSqlParam(9).ParamName = "@EFFECTIVEDATE"
                    pSqlParam(9).Dbtype = BMMDbType.SQL_DateTime
                    pSqlParam(9).Paramvalue = pdtEffectiveDate

                End If
                pSqlParam(10) = New MfgDBParameter
                pSqlParam(10).ParamName = "@FEATURECODE"
                pSqlParam(10).Dbtype = BMMDbType.HANA_NVarChar
                pSqlParam(10).Paramvalue = psFeatureCode


                ' Get the Query on the basis of objIQuery
                psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_AddFeatures)

                iInsert = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))
            End If
            If iInsert > 0 Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
    End Function


    ''' <summary>
    ''' Function to Delete the Feature From Feature Header 
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function DeleteFeatures(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iDelete As Integer
            Dim psFeatureID As Integer
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the Display NAme 
            psFeatureID = NullToInteger(objDataTable.Rows(0)("FeatureId"))

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATUREID"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = psFeatureID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_DeleteFeatures)

            iDelete = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))
            If iDelete > 0 Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
    End Function

    ''' <summary>
    ''' Feature to Update the Features in Feature Header 
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function UpdateFeatures(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As String
        Dim psStatus As String
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim iUpdate As Integer
            Dim psFeatureID As Integer
            Dim psDisplayName, psFeatureDesc, psProductGroupID, psPhotoPath, psCreatedBy, psModifiedBy As String
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the Display NAme 
            psDisplayName = NullToString(objDataTable.Rows(0)("DisplayName"))
            'get the Feature Description 
            psFeatureDesc = NullToString(objDataTable.Rows(0)("FeatureDesc"))
            'Get the Product Group Id 
            psProductGroupID = "Group"
            'get Photo path as String 
            psPhotoPath = NullToString(objDataTable.Rows(0)("PicturePath"))
            'Get the User 
            psModifiedBy = NullToString(objDataTable.Rows(0)("ModifiedBy"))
            'get the Display NAme 
            psFeatureID = NullToInteger(objDataTable.Rows(0)("FeatureId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(6) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@DISPLAYNAME"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psDisplayName

            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@FEATUREDESC"
            pSqlParam(1).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(1).Paramvalue = psFeatureDesc

            pSqlParam(2) = New MfgDBParameter
            pSqlParam(2).ParamName = "@PRODUCTGROUPID"
            pSqlParam(2).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(2).Paramvalue = psProductGroupID

            pSqlParam(3) = New MfgDBParameter
            pSqlParam(3).ParamName = "@PHOTOPATH"
            pSqlParam(3).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(3).Paramvalue = psPhotoPath

            pSqlParam(4) = New MfgDBParameter
            pSqlParam(4).ParamName = "@MODIFIEDBY"
            pSqlParam(4).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(4).Paramvalue = psModifiedBy

            pSqlParam(5) = New MfgDBParameter
            pSqlParam(5).ParamName = "@FEATUREID"
            pSqlParam(5).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(5).Paramvalue = psFeatureID

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_UpdateFeatures)

            iUpdate = (ObjIConnection.ExecuteNonQuery(psSQL, CommandType.Text, pSqlParam))
            If iUpdate > 0 Then
                psStatus = "True"
            Else
                psStatus = "False"
            End If
            Return psStatus
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
    End Function
    ''' <summary>
    ''' Function to get the Model Template Item From the Database ,This Function will execeute in case if Model is Selected in UI Part
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetModelTemplateItem(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetModelTemplateItem)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

    ''' <summary>
    ''' Function to get the Item Code generation on the Basis
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetItemCodeGenerationReference(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetItemCodeGenerationReference)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function



    Public Shared Function CheckDuplicateFeatureCode1(ByVal objCompanyDBId As String, ByVal objFeatureCode As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psFeatureCode As String
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = objCompanyDBId
            'get the Feature Code
            psFeatureCode = objFeatureCode
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATURECODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psFeatureCode


            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckDuplicateFeatureCode)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    ''' <summary>
    ''' Function to Check Duplicate Feature Code on the Basis of Feature Code while Adding the Record
    ''' </summary>
    ''' <param name="objDataTable"></param>
    ''' <param name="objCmpnyInstance"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function CheckDuplicateFeatureCode(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psFeatureCode As String
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the Feature Code
            psFeatureCode = NullToString(objDataTable.Rows(0)("FeatureCode"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@FEATURECODE"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psFeatureCode
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_CheckDuplicateFeatureCode)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function



    Public Shared Function GetAllData(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllData)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, Nothing))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function GetAllDataOnBasisOfSearchCriteria(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psSearchString As String = String.Empty
            Dim pdsGetData As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the Search String
            psSearchString = NullToString(objDataTable.Rows(0)("SearchString"))
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@SEARCHSTRING"
            pSqlParam(0).Dbtype = BMMDbType.HANA_NVarChar
            pSqlParam(0).Paramvalue = psSearchString

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllDataOnBasisOfSearchCriteria)
            'here we needto Replace the Parameter as Like is Used inthe where Clause
            psSQL = psSQL.Replace("@SEARCHSTRING", psSearchString)
            pdsGetData = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsGetData.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function







    Public Shared Function GetAllSavedRecord(ByVal objDataTable As DataTable, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try
            'we will Show 25 Record Per Page so Record Limit is Set to 25
            Dim piPageLimit As Integer = 25
            Dim psCompanyDBId As String = String.Empty
            Dim psSQL As String = String.Empty
            Dim psSearchString As String
            'Variable to Fet Starting Limit and The End Limit
            Dim piStartCount, piEndCount As Integer
            Dim piPageNumber As Integer
            'get the PAge Number which is Coming from UI 
            piPageNumber = NullToString(objDataTable.Rows(0)("PageNumber"))
            'logic to get the End Count 
            piEndCount = piPageNumber * piPageLimit
            'Logic to get the Starting Count 
            piStartCount = piEndCount - piPageLimit + 1
            'if there is Search String then we wil  Fetch Record According t the Search String
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = NullToString(objDataTable.Rows(0)("CompanyDBId"))
            'get the Feature Code
            psSearchString = NullToString(objDataTable.Rows(0)("SearchString"))
            If psSearchString.Length > 0 Then
                'if there is Search String then we wil  Fetch Record According t the Search String
                Dim dtsearchedRecord As DataTable
                dtsearchedRecord = GetAllSavedRecordOnBasisOfSearchCriteria(piStartCount, piEndCount, psSearchString, psCompanyDBId, objCmpnyInstance)
                'We will return the Sorted Record onthe basis of search
                Return dtsearchedRecord
            End If
            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)

            Dim pSqlParam(2) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@STARTCOUNT"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = piStartCount

            pSqlParam(1) = New MfgDBParameter
            pSqlParam(1).ParamName = "@ENDCOUNT"
            pSqlParam(1).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(1).Paramvalue = piEndCount

            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllSavedRecord)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function


    Public Shared Function GetAllSavedRecordOnBasisOfSearchCriteria(ByVal objStartCount As Integer, ByVal ObjEndCount As Integer, ByVal ObjSearchString As String, ByVal ObjCompanyDBId As String, ByVal objCmpnyInstance As OptiPro.Config.Common.Company) As DataTable
        Try


            'if there is Search String then we wil  Fetch Record According t the Search String
            Dim psCompanyDBId, psSearchString, psSQL As String
            Dim piStartIndex, piEndIndex As Integer
            Dim pdsFeatureList As DataSet
            'Get the Company Name
            psCompanyDBId = ObjCompanyDBId
            'get the Seacrch String 
            psSearchString = ObjSearchString
            'get the Starting Index for the Search 
            piStartIndex = objStartCount
            'get the End Index for the Search 
            piEndIndex = ObjEndCount
            'if there is Search String then we wil  Fetch Record According t the Search String

            'Now assign the Company object Instance to a variable pObjCompany
            Dim pObjCompany As OptiPro.Config.Common.Company = objCmpnyInstance
            pObjCompany.CompanyDbName = psCompanyDBId
            pObjCompany.RequireConnectionType = OptiPro.Config.Common.WMSRequireConnectionType.CompanyConnection
            'Now get connection instance i.e SQL/HANA
            Dim ObjIConnection As IConnection = ConnectionFactory.GetConnectionInstance(pObjCompany)
            'Now we will connect to the required Query Instance of SQL/HANA
            Dim ObjIQuery As IQuery = QueryFactory.GetInstance(pObjCompany)
            Dim pSqlParam(1) As MfgDBParameter
            'Parameter 0 consisting warehouse and it's datatype will be nvarchar
            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@STARTCOUNT"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = piStartIndex

            pSqlParam(0) = New MfgDBParameter
            pSqlParam(0).ParamName = "@ENDCOUNT"
            pSqlParam(0).Dbtype = BMMDbType.HANA_Integer
            pSqlParam(0).Paramvalue = piEndIndex
            ' Get the Query on the basis of objIQuery
            psSQL = ObjIQuery.GetQuery(OptiPro.Config.Common.OptiProConfigQueryConstants.OptiPro_Config_GetAllSavedRecordOnBasisOfSearchCriteria)
            pdsFeatureList = (ObjIConnection.ExecuteDataset(psSQL, CommandType.Text, pSqlParam))
            Return pdsFeatureList.Tables(0)
        Catch ex As Exception
            Logger.WriteTextLog("Log: Exception from MoveOrderDL " & ex.Message)
        End Try
        Return Nothing
    End Function

End Class