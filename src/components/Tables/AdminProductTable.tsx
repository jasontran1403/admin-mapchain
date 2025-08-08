import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../../types/constant";
import { toast } from "react-toastify";

interface PriceDetail {
  detail: string;
  priceUSDT: number;
  priceMCT: number;
}

interface Product {
  id: number;
  productName: string;
  status: number;
  owner: string;
  priceDetails: PriceDetail[];
}

interface RateInput {
  adminRate: string;
  userRate: string;
}

export default function AdminProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "decline" | "remove" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rateInputs, setRateInputs] = useState<RateInput[]>([]);
  const [reason, setReason] = useState("");

  const token = `Bearer ${localStorage.getItem("access_token")}`;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 1200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="px-2 py-1 bg-yellow-300 rounded">Pending</span>;
      case 1:
        return <span className="px-2 py-1 bg-green-300 rounded">Available</span>;
      case 2:
        return <span className="px-2 py-1 bg-orange-400 rounded">Declined</span>;
      case 3:
        return <span className="px-2 py-1 bg-red-400 rounded">Removed</span>;
      default:
        return <span>-</span>;
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${URL}admin/products`, {
        params: {
          page,
          size: 4,
          searchTerm: debouncedSearchTerm || undefined,
        },
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearchTerm]);

  const openModal = (product: Product, type: "approve" | "decline" | "remove") => {
    setSelectedProduct(product);
    setModalType(type);
    
    if (type === "approve") {
      // Initialize rate inputs for each price detail
      setRateInputs(product.priceDetails.map(() => ({ adminRate: "", userRate: "" })));
    } else {
      setRateInputs([]);
    }
    
    setReason("");
    setShowModal(true);
  };

  const handleRateChange = (index: number, field: keyof RateInput, value: string) => {
    const newRateInputs = [...rateInputs];
    newRateInputs[index] = {
      ...newRateInputs[index],
      [field]: value
    };
    setRateInputs(newRateInputs);
  };

  const submitAction = async () => {
    if (!selectedProduct || !modalType) return;

    let payload: any = { productId: selectedProduct.id };

    if (modalType === "approve") {
      // Validate all rate inputs
      for (let i = 0; i < rateInputs.length; i++) {
        const { adminRate, userRate } = rateInputs[i];
        const admin = parseFloat(adminRate);
        const user = parseFloat(userRate);
        const priceDetail = selectedProduct.priceDetails[i];
        
        if (isNaN(admin) || isNaN(user) || admin <= 0 || user <= 0) {
          toast.warning(`Please enter valid rates for "${priceDetail.detail}"`);
          return;
        }
        
        const sum = admin + user;
        if (Math.abs(priceDetail.priceUSDT - sum) >= 0.01) {
          toast.warning(`The sum of rates for "${priceDetail.detail}" must equal ${priceDetail.priceUSDT} USDT`);
          return;
        }
      }
      
      payload.type = 1;
      payload.rates = selectedProduct.priceDetails.map((detail, index) => ({
        detail: detail.detail,
        adminRate: parseFloat(rateInputs[index].adminRate),
        userRate: parseFloat(rateInputs[index].userRate)
      }));
    }

    if (modalType === "decline") {
      if (!reason.trim()) {
        toast.warning("Please enter a reason for declining");
        return;
      }
      payload.type = 2;
      payload.reason = reason;
    }

    if (modalType === "remove") {
      if (!reason.trim()) {
        toast.warning("Please enter a reason for removal");
        return;
      }
      payload.type = 3;
      payload.reason = reason;
    }

    try {
      await axios.post(`${URL}admin/toggle-product`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by display name..."
          className="border p-2 rounded w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-start">Owner</th>
              <th className="p-2 border text-start">Name</th>
              <th className="p-2 border text-start">Details</th>
              <th className="p-2 border text-start">Status</th>
              <th className="p-2 border text-start min-w-[160px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="text-center">
                <td className="p-2 border text-start">{p.owner}</td>
                <td className="p-2 border text-start">{p.productName}</td>
                <td className="border text-start p-2 min-w-[400px]">
                  {p.priceDetails.length > 0 ? (
                    p.priceDetails.map((detail, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="font-medium">
                          {detail.detail} - {detail.priceUSDT?.toLocaleString()} USDT -{" "}
                          {detail.priceMCT?.toLocaleString()} MCT
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No product details available.</p>
                  )}
                </td>
                <td className="border p-2">{getStatusBadge(p.status)}</td>
                <td className="border p-2 text-start">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => openModal(p, "approve")}
                      className="w-24 px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openModal(p, "decline")}
                      className="w-24 px-2 py-1 bg-orange-500 text-white rounded"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => openModal(p, "remove")}
                      className="w-24 px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 capitalize">{modalType} Product</h2>

            {modalType === "approve" && selectedProduct && (
              <>
                <div className="space-y-4">
                  {selectedProduct.priceDetails.map((detail, idx) => (
                    <div key={idx} className="p-4 border rounded">
                      <h3 className="font-medium mb-2">&#x2022;  {detail.detail} - Price: {detail.priceUSDT} USDT</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="number"
                            placeholder="Admin Rate"
                            className="border p-2 rounded w-full"
                            min={0}
                            value={rateInputs[idx]?.adminRate || ""}
                            onChange={(e) => handleRateChange(idx, "adminRate", e.target.value)}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="User Rate"
                            className="border p-2 rounded w-full"
                            min={0}
                            value={rateInputs[idx]?.userRate || ""}
                            onChange={(e) => handleRateChange(idx, "userRate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(modalType === "decline" || modalType === "remove") && (
              <>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  placeholder={`Enter reason for ${modalType === "decline" ? "declining" : "removing"}...`}
                  className="border p-2 rounded w-full mb-2"
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}