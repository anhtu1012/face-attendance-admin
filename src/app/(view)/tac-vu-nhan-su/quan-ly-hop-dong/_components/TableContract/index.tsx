/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { UserContractItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { useSelectData } from "@/hooks/useSelectData";
import QuanLyHopDongServices from "@/services/tac-vu-nhan-su/quan-ly-hop-dong/quan-ly-hop-dong.service";
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
import { AiFillSignature } from "react-icons/ai";
import { FaFileContract } from "react-icons/fa";
import {
  FormValues,
  TableContractProps,
  TableContractRef,
} from "../../_types/prop";
import ContractDetailModal from "../ContractDetailModal/ContractDetailModal";

const defaultPageSize = 20;
const TableContract = forwardRef<TableContractRef, TableContractProps>(
  ({ filterRef, onAddAppendix, onTerminateContract }, ref) => {
    const mes = useTranslations("HandleNotion");
    const t = useTranslations("TableContract");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItem, setTotalItems] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [loading, setLoading] = useState(true);
    const [rowData, setRowData] = useState<UserContractItem[]>([]);
    const gridRef = useRef<AgGridReact>({} as AgGridReact);
    const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
      undefined
    );
    const { selectStatusContract } = useSelectData();

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState<string | null>(
      null
    );

    useImperativeHandle(ref, () => ({
      refetch: () => fetchData(1, pageSize, quickSearchText),
    }));

    const columnDefs: ColDef[] = useMemo(
      () => [
        {
          field: "status",
          headerName: t("status"),
          editable: false,
          width: 150,
          context: {
            typeColumn: "Tag",
            selectOptions: selectStatusContract,
          },
          cellRendererParams: {
            colorMap: {
              PENDING: "#FB8C00",
              USER_SIGNED: "#1976D2",
              DIRECTOR_SIGNED: "#0288D1",
              INACTIVE: "#00796B",
              EXPIRED: "#C62828",
              ACTIVE: "#2E7D32",
            },
          },
        },
        {
          field: "contractNumber",
          headerName: t("contractNumber"),
          editable: false,
          width: 150,
        },
        {
          field: "contractTypeName",
          headerName: t("titleContractName"),
          editable: false,
          width: 200,
        },
        {
          field: "fullNameUser",
          headerName: t("fullNameUser"),
          editable: false,
          width: 150,
        },
        {
          field: "positionName",
          headerName: t("positionName"),
          editable: false,
          width: 150,
        },
        {
          field: "startDate",
          headerName: t("startDate"),
          editable: false,
          width: 250,
          context: {
            typeColumn: "Date",
          },
        },
        {
          field: "endDate",
          headerName: t("endDate"),
          editable: false,
          width: 250,
          context: {
            typeColumn: "Date",
          },
        },
        {
          field: "duration",
          headerName: t("duration"),
          editable: false,
          width: 150,
          valueFormatter: (params) => {
            if (params.value) {
              const minutes = Number(params.value);
              const minutesPerDay = 1440;
              const daysPerMonth = 30.4167; // trung bình

              const totalDays = Math.floor(minutes / minutesPerDay);

              if (totalDays >= 1) {
                // Tính tháng dựa trên totalDays để tránh lỗi float khi nhân minutesPerMonth*12
                let months = Math.floor(totalDays / daysPerMonth);

                // Lấy số ngày còn lại (làm tròn)
                let days = Math.round(totalDays - months * daysPerMonth);

                // Nếu do làm tròn mà days bằng số ngày trung bình 1 tháng => coi là 1 tháng đầy
                const roundedDaysPerMonth = Math.round(daysPerMonth);
                if (days >= roundedDaysPerMonth) {
                  months += 1;
                  days = 0;
                }

                // Khống chế trường hợp âm (phòng lỗi)
                months = Math.max(0, months);
                days = Math.max(0, days);

                if (months > 0) {
                  return `${months} tháng${days > 0 ? ` ${days} ngày` : ""}`;
                }
                return `${totalDays} ngày`;
              }

              // Dưới 1 ngày: giờ + phút
              if (minutes >= 60) {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hours} giờ${mins > 0 ? ` ${mins} phút` : ""}`;
              }

              return `${minutes} phút`;
            }
            return "";
          },
        },
      ],
      [t, selectStatusContract]
    );
    const fetchData = useCallback(
      async (
        currentPage: number,
        pageSize: number,
        quickSearchText: string | undefined
      ) => {
        setLoading(true);
        try {
          const searchFilter: FilterQueryStringTypeItem[] = [
            { key: "limit", type: FilterOperationType.Eq, value: pageSize },
            {
              key: "offset",
              type: FilterOperationType.Eq,
              value: (currentPage - 1) * pageSize,
            },
          ];

          const filterValues: Partial<FormValues> =
            filterRef.current?.getFormValues() || {};
          console.log({ filterValues });

          const params: any = {
            fromDate:
              filterValues.filterDateRange && filterValues.filterDateRange[0]
                ? filterValues.filterDateRange[0].toISOString()
                : undefined,
            toDate:
              filterValues.filterDateRange && filterValues.filterDateRange[1]
                ? filterValues.filterDateRange[1].toISOString()
                : undefined,
          };
          const response = await QuanLyHopDongServices.getQuanLyHopDong(
            searchFilter,
            quickSearchText,
            params
          );
          setRowData(response.data);
          setTotalItems(response.count || 0);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      },
      [filterRef]
    );

    const dataGrid = useDataGridOperations<UserContractItem>({
      gridRef,
      createNewItem: () => {
        return {} as UserContractItem;
      },
      mes,
      rowData,
      setRowData,
      requiredFields: [],
      t,
      // Quicksearch parameters
      setCurrentPage,
      setPageSize,
      setQuickSearchText,
      fetchData,
      columnDefs,
    });

    const buttonProps = (_params: any) => {
      const defaultViewButton = (
        <Tooltip title="Xem chi tiết">
          <FaFileContract
            style={{ cursor: "pointer", color: "#0288D1" }}
            size={20}
            onClick={() => {
              setSelectedContractId(_params.data.id);
              setModalOpen(true);
            }}
          />
        </Tooltip>
      );
      if (_params.data.status === "ACTIVE") {
        return (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {defaultViewButton}
            <Tooltip title="Ký tên">
              <AiFillSignature
                style={{ cursor: "pointer", color: "#0288D1" }}
                size={20}
                onClick={() => {
                  window.location.href = `/tac-vu-nhan-su/quan-ly-hop-dong/${_params.data.id}/signature`;
                }}
              />
            </Tooltip>
          </div>
        );
      }
      return defaultViewButton;
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
          toolColumnWidth={100}
          pagination={true}
          paginationPageSize={pageSize}
          paginationCurrentPage={currentPage}
          onChangePage={(currentPage, pageSize) => {
            setCurrentPage(currentPage);
            setPageSize(pageSize);
            fetchData(currentPage, pageSize, quickSearchText);
          }}
          maxRowsVisible={13}
          columnFlex={0}
          onQuicksearch={dataGrid.handleQuicksearch}
          showActionButtons={false}
        />

        <ContractDetailModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedContractId(null);
          }}
          contractId={selectedContractId}
          onAddAppendix={onAddAppendix}
          onTerminateContract={onTerminateContract}
        />
      </div>
    );
  }
);

TableContract.displayName = "TableContract";

export default TableContract;
