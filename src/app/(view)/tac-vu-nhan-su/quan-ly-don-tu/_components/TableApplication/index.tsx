/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { ApplicationItem } from "@/dtos/tac-vu-nhan-su/quan-ly-don-tu/application.dto";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { useSelectData } from "@/hooks/useSelectData";
import QuanLyDonTuServices from "@/services/tac-vu-nhan-su/quan-ly-don-tu/quan-ly-don-tu.service";
import { getDowFromDate } from "@/utils/client/getDowFromDate";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { Tooltip } from "antd";
import { useTranslations } from "next-intl";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaEye } from "react-icons/fa";
import { TableApplicationProps, TableApplicationRef } from "../../_types/prop";
import ApplicationDetailModal from "../ApplicationDetailModal/ApplicationDetailModal";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";

const defaultPageSize = 20;

const TableApplication = forwardRef<TableApplicationRef, TableApplicationProps>(
  ({ filterRef }, ref) => {
    const mes = useTranslations("HandleNotion");
    // const t = useTranslations("TableApplication");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItem, setTotalItems] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState<ApplicationItem[]>([]);
    const gridRef = useRef<AgGridReact>({} as AgGridReact);
    const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
      undefined
    );
    const { selectStatusForm } = useSelectData();
    const messageApi = useAntdMessage();

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] =
      useState<ApplicationItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      refetch: () => fetchData(1, pageSize, quickSearchText),
    }));

    const columnDefs: ColDef[] = useMemo(
      () => [
        {
          field: "status",
          headerName: "Trạng thái",
          editable: false,
          width: 130,
          context: {
            typeColumn: "Tag",
            selectOptions: selectStatusForm,
          },
          cellRendererParams: {
            colorMap: {
              PENDING: "#FB8C00",
              ACCEPTED: "#2E7D32",
              REJECTED: "#C62828",
              CANCELLED: "#757575",
              INACTIVE: "#757575",
            },
          },
        },
        {
          field: "formCategoryTitle",
          headerName: "Loại đơn",
          editable: false,
          width: 180,
        },
        {
          field: "submittedName",
          headerName: "Người nộp đơn",
          editable: false,
          width: 150,
        },
        {
          field: "reason",
          headerName: "Lý do",
          editable: false,
          width: 400,
          cellRenderer: (params: any) => {
            const text = params.value || "";
            return (
              <Tooltip title={text}>
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {text}
                </div>
              </Tooltip>
            );
          },
        },
        {
          field: "startTime",
          headerName: "Thời gian bắt đầu",
          editable: false,
          width: 180,
          context: {
            typeColumn: "Date",
          },
        },
        {
          field: "endTime",
          headerName: "Thời gian kết thúc",
          editable: false,
          width: 180,
          context: {
            typeColumn: "Date",
          },
        },
        {
          field: "createdAt",
          headerName: "Ngày tạo",
          editable: false,
          width: 180,
          context: {
            typeColumn: "Date",
          },
        },
        {
          field: "approvedName",
          headerName: "Người duyệt",
          editable: false,
          width: 150,
          valueFormatter: (params) => params.value || "Chưa duyệt",
        },
        {
          field: "approvedTime",
          headerName: "Thời gian duyệt",
          editable: false,
          width: 180,
          context: {
            typeColumn: "Date",
          },
        },
      ],
      [selectStatusForm]
    );

    const fetchData = useCallback(
      async (
        currentPage: number,
        pageSize: number,
        quickSearchText: string | undefined
      ) => {
        setLoading(true);
        try {
          const filterValues = filterRef.current?.getFormValues() || {};
          const filters = {
            ...(filterValues.filterDateRange
              ? {
                  fromDate: filterValues.filterDateRange[0].toISOString(),
                  toDate: filterValues.filterDateRange[1].toISOString(),
                }
              : {}),
            ...(filterValues.status ? { status: filterValues.status } : {}),
            ...(filterValues.submittedName
              ? { submittedBy: filterValues.submittedName }
              : {}),
            ...(filterValues.approvedName
              ? { approvedName: filterValues.approvedName }
              : {}),
          };
          const searchFilter: FilterQueryStringTypeItem[] = [
            { key: "limit", type: FilterOperationType.Eq, value: pageSize },
            {
              key: "offset",
              type: FilterOperationType.Eq,
              value: (currentPage - 1) * pageSize,
            },
          ];
          const res = await QuanLyDonTuServices.getQuanLyDonTu(
            searchFilter,
            quickSearchText,
            filters
          );

          setRowData(res.data);
          setTotalItems(res.count || 0);
        } catch (error) {
          console.log(error);
          messageApi.error("Có lỗi xảy ra khi tải dữ liệu");
        } finally {
          setLoading(false);
        }
      },
      [filterRef]
    );

    const dataGrid = useDataGridOperations<ApplicationItem>({
      gridRef,
      createNewItem: () => {
        return {} as ApplicationItem;
      },
      mes,
      rowData,
      setRowData,
      requiredFields: [],
      setCurrentPage,
      setPageSize,
      setQuickSearchText,
      fetchData,
      columnDefs,
    });

    const buttonProps = (params: any) => {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Tooltip title="Xem chi tiết">
            <FaEye
              style={{ cursor: "pointer", color: "#0288D1" }}
              size={20}
              onClick={() => {
                setSelectedApplication(params.data);
                setModalOpen(true);
              }}
            />
          </Tooltip>
        </div>
      );
    };

    const handleUpdateStatus = async (
      id: string,
      response: string | undefined,
      status: "ACCEPTED" | "REJECTED"
    ) => {
      try {
        setActionLoading(true);
        // Use the selected application's startTime to derive dow (weekday)
        const dow = getDowFromDate(selectedApplication?.startTime || undefined);
        const res = await QuanLyDonTuServices.approveQuanLyDonTu(id, {
          status,
          response,
          dow,
        });
        messageApi.success(
          status === "ACCEPTED"
            ? "Duyệt đơn thành công"
            : "Từ chối đơn thành công"
        );
        // Update local state
        const updatedData = rowData.map((item) =>
          item.id === res.id
            ? {
                ...item,
                status: res.status,
                approvedBy: res.approvedBy,
                approvedName: res.approvedName,
                approvedTime: res.approvedTime,
                response: response,
              }
            : item
        );
        setRowData(updatedData);
        setModalOpen(false);
        setSelectedApplication(null);
        setActionLoading(false);
      } catch (error) {
        console.log(error);
        messageApi.error("Có lỗi xảy ra khi cập nhật trạng thái đơn");
      } finally {
        setActionLoading(false);
      }
    };

    return (
      <div>
        <AgGridComponentWrapper
          showSearch={true}
          rownumber={true}
          rowData={dataGrid.rowData}
          loading={loading}
          columnDefs={columnDefs}
          gridRef={gridRef}
          total={totalItem}
          rowSelection={{
            mode: "singleRow",
            enableClickSelection: true,
            checkboxes: false,
          }}
          showToolColumn={true}
          toolColumnRenderer={buttonProps}
          toolColumnWidth={60}
          pagination={true}
          paginationPageSize={pageSize}
          paginationCurrentPage={currentPage}
          onChangePage={(currentPage, pageSize) => {
            setCurrentPage(currentPage);
            setPageSize(pageSize);
            fetchData(currentPage, pageSize, quickSearchText);
          }}
          maxRowsVisible={14}
          columnFlex={0}
          onQuicksearch={dataGrid.handleQuicksearch}
          showActionButtons={false}
        />

        <ApplicationDetailModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          onApprove={handleUpdateStatus}
          onReject={handleUpdateStatus}
          processing={actionLoading}
          onRefresh={() => fetchData(currentPage, pageSize, quickSearchText)}
        />
      </div>
    );
  }
);

TableApplication.displayName = "TableApplication";

export default TableApplication;
