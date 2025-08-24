import React from "react";
import { useState, useRef, useEffect } from "react";
import DepositProcess from "./DepositProcess";
import CategorySelectionModal from "./CategorySelectionModal";
import SalesSlipEntryRegistration from "./SalesSlipEntryRegistration";
import { DownArrowIcon } from "../../transaction_information/LeftPanel";
import ProductSearchModal from "./ProductSearchModal";
import SaleDetailModal from "./SaleDetail/SaleDetailModal";
import StatusBar from "../StatusBar";
import { createPortal } from "react-dom";


export default function SalesSlipEntry() {
    const [labelDeposit, setLabelDeposit] = useState("入金処理");
    const [isDeposited, setIsDeposited] = useState(false);
    const [isOpenCategorySelection, setIsOpenCategorySelection] = useState(false);
    const [isOpenDepositProcess, setIsOpenDepositProcess] = useState(false);
    const [isProductSearchModalOpen, setProductSearchModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSaleDetailModalOpen, setIsSaleDetailModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [saleSlips, setSaleSlips] = useState([
        {
            headerRow: {
                no: "01",
                icon: "",
                categoryName: "売上",
                outsideMonth: 1,
                selfTransferTarget: 1,
            },
            bodyRow: {
                titleInfo: {
                    productName: "パロマ 給湯器 PH-163EWS",
                    supplierName: "ABC商事",
                },
                detailInfo: {
                    quantity: "01",
                    tax: "100,000",
                },
                note: "備考がある場合追加で表示。当月分が空白の場合ラベルは非表示。",
            },
        },
        {
            headerRow: {
                no: "02",
                icon: "",
                categoryName: "売上",
                outsideMonth: 1,
                selfTransferTarget: 1,
            },
            bodyRow: {
                titleInfo: {
                    productName: "リンナイ 給湯器 RUX-V1615W-E",
                    supplierName: "XYZ商会",
                },
                detailInfo: {
                    quantity: "02",
                    tax: "200,000",
                },
                note: "",
            },
        },
    ]);

    const [activeSlipIndex, setActiveSlipIndex] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
    const slipRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleClickSlip = (index: number) => {
        if (activeSlipIndex === index) {
            setActiveSlipIndex(null);
            setTooltipPos(null);
            return;
        }
        setActiveSlipIndex(index);

        // Lấy tọa độ slip để định vị tooltip
        const rect = slipRefs.current[index]?.getBoundingClientRect();
        if (rect) {
            setTooltipPos({
                top: rect.top + window.scrollY + rect.height / 2 - 30, // căn giữa slip
                left: rect.right + 10 + window.scrollX, // đặt tooltip bên phải slip
            });
        }
    };

    // 🔑 Click outside để đóng tooltip
    // useEffect(() => {
    //     function handleClickOutside(e: MouseEvent) {
    //         // Nếu tooltip đang mở
    //         if (activeSlipIndex !== null) {
    //             const clickedInsideSlip = slipRefs.current[activeSlipIndex]?.contains(e.target as Node);
    //             if (!clickedInsideSlip) {
    //                 setActiveSlipIndex(null);
    //                 setTooltipPos(null);
    //             }
    //         }
    //     }

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, [activeSlipIndex]);

    const handleAddSaleSlip = (data: any) => {
        setSaleSlips([...saleSlips, data]);
    }

    const handleDeleteLine = (index: number) => {
        setSaleSlips((prev) => prev.filter((_, i) => i !== index));
        setActiveSlipIndex(null); // ẩn balloon sau khi delete
    };

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setIsOpenCategorySelection(false);
        setProductSearchModalOpen(true);
        setCurrentStep(2);
    };

    const handleBackToCategory = () => {
        setProductSearchModalOpen(false);
        setIsOpenCategorySelection(true);
    };

    return (
        <div className="bg-white w-full h-full flex flex-col items-center px-4 pt-4 2xl:text-[16px] text-[11px]">
            {/* Header */}
            <div className="w-3/4 border border-black">
                <div className="bg-[#D9D9D9] text-center font-bold py-2">
                    <h1 className="text-[24px] font-bold text-black">売上伝票入力</h1>
                </div>
            </div>
            <div className="h-full w-3/5 mx-60 mt-4">
                {/* Customer Info */}
                <div className="w-full p-2 grid lg:grid-cols-4 grid-cols-3  gap-x-4 gap-y-2 whitespace-nowrap font-bold  text-black border border-black">
                    <div className="flex items-center">
                        <label className="w-1/2 bg-[#D9D9D9] px-2 py-1 border border-black text-center">
                            顧客氏名
                        </label>
                        <span className="ml-1 w-1/2 px-2 py-1">山田太郎</span>
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/2 bg-[#D9D9D9] px-2 py-1 border border-black text-center">
                            売上日
                        </label>
                        <input
                            type="text"
                            defaultValue="2025/05/01"
                            className="ml-1 w-1/2 border border-black px-2 py-1"
                        />
                        <button className="mx-1 w-[20px] h-[20px] inset-y-0 right-0 flex items-center px-1 bg-white border border-gray-500 cursor-pointer">
                            <DownArrowIcon />
                        </button>
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/2 bg-[#D9D9D9] px-2 py-1 border border-black text-center">
                            品番No.
                        </label>
                        <input
                            type="text"
                            defaultValue="0000000000"
                            className="ml-1 w-1/2 border border-black text-black px-2 py-1"
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/2 bg-[#D9D9D9] px-2 py-1 border border-black text-center">
                            伝票No.
                        </label>
                        <input
                            type="text"
                            defaultValue="0000000000"
                            className="ml-1 w-1/2 border border-black px-2 py-1"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/2 bg-[#D9D9D9] px-2 py-1 border border-black text-center">
                            請求年月
                        </label>
                        <input
                            type="text"
                            defaultValue="2025/05"
                            className="ml-1 w-1/2 border border-black px-2 py-1"
                        />
                        <button className="mx-1 w-[20px] h-[20px] inset-y-0 right-0 flex items-center px-1 bg-white border border-gray-500 cursor-pointer">
                            <DownArrowIcon />
                        </button>
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/2 bg-[#D9D9D9] px-2 py-1 border border-black text-center">
                            担当者
                        </label>
                        <input
                            type="text"
                            defaultValue="営業タロウ"
                            className="ml-1 w-1/2 border border-black px-2 py-1"
                        />
                        <button className="mx-1 w-[20px] h-[20px] inset-y-0 right-0 flex items-center px-1 bg-white border border-gray-500 cursor-pointer">
                            <DownArrowIcon />
                        </button>
                    </div>
                </div>
                {/* <SalesSlipEntryRegistration
                    headerRow={{
                        no: "02",
                        icon: "",
                        categoryName: "売上",
                        outsideMonth: 1,
                        selfTransferTarget: 1,
                    }}
                    bodyRow={{
                        titleInfo: {
                            productName: "パロマ 給湯器 PH-163EWS",
                            supplierName: "ABC商事",
                        },
                        detailInfo: {
                            quantity: "01",
                            tax: "100,000",
                        },
                        note: "備考がある場合追加で表示。当月分が空白の場合ラベルは非表示。",
                    }}
                /> */}
                <div className="max-h-96 overflow-y-auto border p-2 relative">
                    {saleSlips.map((slip, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                slipRefs.current[index] = el;
                            }}
                            onClick={() => handleClickSlip(index)}
                        >
                            <SalesSlipEntryRegistration
                                headerRow={slip.headerRow}
                                bodyRow={slip.bodyRow}
                            />
                        </div>
                    ))}

                    {/* Tooltip hiển thị bằng Portal */}
                    {activeSlipIndex !== null && tooltipPos &&
                        createPortal(
                            <div
                                style={{
                                    position: "absolute",
                                    top: tooltipPos.top,
                                    left: tooltipPos.left,
                                    zIndex: 9999,
                                }}
                            >
                                <div className="relative bg-white border shadow-lg rounded-md p-2">
                                    {/* Mũi tên bên trái */}
                                    <div
                                        className="absolute top-4 -left-2 w-0 h-0 
                           border-t-8 border-b-8 border-r-8 border-transparent border-r-white"
                                    ></div>

                                    <button className="block w-full text-left px-2 py-1 hover:bg-gray-100">
                                        行編集
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLine(activeSlipIndex)}
                                        className="block w-full text-left px-2 py-1 hover:bg-gray-100">
                                        行削除
                                    </button>
                                    <button
                                        onClick={() => setIsOpenCategorySelection(true)}
                                        className="block w-full text-left px-2 py-1 hover:bg-gray-100">
                                        行追加
                                    </button>
                                </div>
                            </div>,
                            document.body
                        )}
                </div>
                {/* 行追加 */}
                <div className="flex justify-center items-center my-6 font-bold text-[16px] text-black">
                    <button
                        className="bg-[#EEEEEE] border border-black px-12 py-2 rounded shadow-md shadow-zinc-600"
                        onClick={() => setIsOpenCategorySelection(true)}
                    >
                        行追加
                    </button>
                </div>

                {/* 売上合計 */}
                <div className="w-full flex justify-end font-bold text-[16px] text-black">
                    <div className="flex border border-black p-2 w-80">
                        <div className="w-1/2 flex justify-center items-center">
                            <span className="bg-[#D9D9D9] px-2 py-1 border border-black text-center">
                                売上合計
                            </span>
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between px-2 py-1">
                                <div></div>
                                <div>0　</div>
                            </div>
                            <div className="flex justify-between px-2 py-1">
                                <div>（税</div>
                                <div>０）</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 入金処理 */}
            </div>
            <div className="w-3/5 bottom-0 flex justify-center items-center mt-12 font-bold text-[16px] text-black">
                <button
                    className="bg-[#D9D9D9] border border-black px-12 py-2 rounded"
                    onClick={() => setIsOpenDepositProcess(!isOpenDepositProcess)}
                >
                    {labelDeposit}
                </button>
            </div>
            <div className="w-3/5 mt-0">
                {isOpenDepositProcess && (
                    <DepositProcess
                        isDeposited={isDeposited}
                        onClose={() => {
                            setIsOpenDepositProcess(false);
                            setLabelDeposit("入金処理");
                        }}
                        onSave={() => {
                            setLabelDeposit("入金済み");
                            setIsDeposited(true);
                            setIsOpenDepositProcess(false);
                        }}
                    />
                )}
            </div>
            {isOpenCategorySelection && (
                <CategorySelectionModal
                    onClose={() => setIsOpenCategorySelection(false)}
                    onCategorySelect={handleCategorySelect}
                />
            )}
            {currentStep === 2 && (
                <ProductSearchModal
                    isOpen={isProductSearchModalOpen}
                    onClose={handleBackToCategory}
                    categoryName={selectedCategory}
                    onNext={() => setCurrentStep(3)}
                />
            )}
            {currentStep === 3 && (
                <SaleDetailModal
                    isOpen={isSaleDetailModalOpen}
                    onClose={() => setCurrentStep(2)}
                    categoryName={selectedCategory}
                    onNext={handleAddSaleSlip}
                />
            )}
        </div>
    );
}
