// // ...existing imports...
// import { useDataGridOperations } from "@/hooks/useDataGridOperations";

// const ProductManifest: React.FC = () => {
//   const mes = useTranslations("HandleNotion");
//   const t = useTranslations("ProductManifest");
//   const gridRef = useRef<AgGridReact>(null);
//   const [form] = Form.useForm();

//   // Các state đặc thù của màn hình này
//   const [selectedShipKey, setSelectedShipKey] = useState<string>("");
//   const [selectedShipData, setSelectedShipData] = useState<any>(null);
//   const [localSztpOptions, setLocalSztpOptions] = useState<{ oprCD: string; localSztp: string }[]>([]);
//   const [rowOptions, setRowOptions] = useState<Record<number, string[]>>({});
//   // ... các state khác đặc thù

//   // Validation function
//   const validateRowData = useCallback((data: dtoMnfLd): boolean => {
//     // ... logic validation như cũ
//   }, [t, mes]);

//   // Use the hook
//   const dataGrid = useDataGridOperations<dtoMnfLd>({
//     gridRef,
//     createNewItem: (i) => ({
//       unitKey: `${Date.now()}_${i}`,
//       shipKey: selectedShipKey,
//       // ... other fields
//     }),
//     validateRowData,
//     duplicateCheckField: "cntrNo",
//     mes,
//     fetchData: () => fetchDataCus(dataGrid.currentPage, defaultPageSize, dataGrid.params, selectedShipKey),
//     addItemAPI: createListContainerExport,
//     updateItemAPI: updateListContainerExportLkhh,
//     deleteItemAPI: deleteLkhh,
//   });

//   // Custom cell value changed logic
//   const handleCellValueChanged = useCallback(
//     async (event: any) => {
//       const customLogic = async (event: any) => {
//         const { newValue, data } = event;
//         const fieldName = event.colDef.field;

//         // Custom logic cho màn hình này
//         if (fieldName === "cargoTypeCD" && event.oldValue !== newValue) {
//           store.dispatch(clearAllItemErrors());
//           validateRowData(event.data);
//         }

//         if (fieldName === "oprCD" && event.oldValue !== newValue) {
//           // Logic xử lý oprCD change
//           const options = await fetchFilteredLocalSZPTOptions(newValue);
//           // ... xử lý như cũ
//         }

//         // ... other custom logic
//       };

//       dataGrid.onCellValueChanged(event, customLogic);
//     },
//     [dataGrid, validateRowData]
//   );

//   // Create paste handler with custom processing
//   const { handleFillChanges: fillChangesHandler } = dataGrid.createPasteHandler(
//     columnDefs,
//     (newData) => {
//       // Custom processing for this screen
//       return newData.map((item) => {
//         const processedItem = { ...item };
//         // Custom boolean handling
//         if (typeof processedItem.vgm === "string") {
//           processedItem.vgm = processedItem.vgm?.toString().toLowerCase() === "true" || processedItem.vgm === "1";
//         }
//         return processedItem;
//       });
//     }
//   );

//   // Custom quick search
//   const handleQuicksearch = useCallback(
//     (searchText: string, selectedFilterColumns: any[], filterValues: string, paginationSize: number) => {
//       dataGrid.handleQuicksearch(
//         searchText,
//         selectedFilterColumns,
//         filterValues,
//         paginationSize,
//         columnDefs,
//         (page, size, params) => {
//           fetchDataCus(page, size, params, selectedShipKey, form.getFieldValue("blNo"), form.getFieldValue("fpod"), false);
//         }
//       );
//     },
//     [dataGrid, columnDefs, selectedShipKey, form]
//   );

//   // ... rest of component logic

//   if (!dataGrid.isClient) {
//     return null;
//   }

//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <LayoutContent
//         layoutType={3}
//         content1={/* ... form content */}
//         content2={
//           <AgGridComponent
//             rowData={dataGrid.rowData}
//             loading={dataGrid.loading}
//             columnDefs={columnDefs}
//             onCellValueChanged={handleCellValueChanged}
//             onSelectionChanged={dataGrid.onSelectionChanged}
//             gridRef={gridRef}
//             onQuicksearch={handleQuicksearch}
//             onFillChanges={fillChangesHandler}
//             showActionButtons={true}
//             actionButtonsProps={{
//               onDelete: dataGrid.deleteRow,
//               onSave: dataGrid.onSave,
//               rowSelected: dataGrid.rowSelected,
//               showAddRowsModal: true,
//               modalInitialCount: 1,
//               onModalOk: dataGrid.handleModalOk,
//             }}
//           />
//         }
//       />
//     </div>
//   );
// };
