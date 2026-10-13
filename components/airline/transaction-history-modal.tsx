import { useState, useEffect } from "react";
import { X, ArrowDownRight, ArrowUpRight, Loader2, Search, User as UserIcon } from "lucide-react";

interface Transaction {
  _id: string;
  type: 'DEPOSIT' | 'PAYMENT';
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  walletBalance: number;
}

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  isAdminMode?: boolean;
}

export function TransactionHistoryModal({ isOpen, onClose, userId, isAdminMode = false }: TransactionHistoryModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && userId && !isAdminMode) {
      fetchHistory(userId);
    }
    
    if (isOpen && isAdminMode) {
      // Reset state khi mở Admin mode
      setTransactions([]);
      setUserInfo(null);
      setSearchQuery("");
      setError("");
    }
  }, [isOpen, userId, isAdminMode]);

  const fetchHistory = async (id: string, queryStr?: string) => {
    setIsLoading(true);
    setError("");
    try {
      let url = `/api/wallet/history?`;
      if (isAdminMode && queryStr) {
        url += `query=${encodeURIComponent(queryStr)}&role=admin`;
      } else {
        url += `userId=${id}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setTransactions(data.transactions);
        setUserInfo(data.user);
      } else {
        setError(data.message || "Không tìm thấy dữ liệu.");
        setTransactions([]);
        setUserInfo(null);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchHistory("", searchQuery.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#005f73] px-6 py-4 flex items-center justify-between text-white rounded-t-2xl">
          <h3 className="font-bold text-lg">
            {isAdminMode ? "Quản Trị: Tra Cứu Giao Dịch" : "Lịch Sử Giao Dịch"}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
          
          {/* Admin Search Bar */}
          {isAdminMode && (
            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <form onSubmit={handleAdminSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập Email hoặc SĐT khách hàng (VD: 0909123456)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !searchQuery.trim()}
                  className="bg-[#005f73] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#004d61] disabled:opacity-50 transition-colors"
                >
                  Tra Cứu
                </button>
              </form>
              {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
            </div>
          )}

          {/* User Info (Hiển thị cho Admin khi tìm thấy) */}
          {isAdminMode && userInfo && (
            <div className="mb-6 bg-[#005f73]/5 p-4 rounded-xl border border-[#005f73]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#005f73]/10 p-2 rounded-full">
                  <UserIcon className="w-6 h-6 text-[#005f73]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{userInfo.fullName}</h4>
                  <p className="text-xs text-gray-500">{userInfo.email} • {userInfo.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Số dư hiện tại</p>
                <p className="text-lg font-bold text-[#005f73]">{userInfo.walletBalance.toLocaleString()} VNĐ</p>
              </div>
            </div>
          )}

          {/* Transactions List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#005f73] animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {(!isAdminMode || userInfo) && transactions.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
                  <p>Chưa có giao dịch nào.</p>
                </div>
              )}
              
              {transactions.map((tx) => {
                const isDeposit = tx.type === 'DEPOSIT';
                return (
                  <div key={tx._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${isDeposit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isDeposit ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.createdAt).toLocaleString('vi-VN')} • {tx.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>
                      {isDeposit ? '+' : '-'}{tx.amount.toLocaleString()}đ
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
