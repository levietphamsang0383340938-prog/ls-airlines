const authService = {
  // Hàm Đăng nhập
  login: async (data: any) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Tạo custom error với đầy đủ thông tin từ server
      const error: any = new Error(result.message || 'Đăng nhập thất bại');
      error.response = {
        data: result,
        status: response.status
      };
      throw error;
    }

    // LƯU TRỮ TRẠNG THÁI ĐĂNG NHẬP (Quan trọng để UI nhận diện tài khoản)
    if (result.token && result.user) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('currentUser', JSON.stringify(result.user)); // Cập nhật cả currentUser để đồng bộ với Sidebar
    }

    return result;
  },

  // Hàm Đăng ký (Đoạn này fix lỗi đỏ trong ảnh của bạn)
  register: async (data: any) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Tạo custom error với đầy đủ thông tin từ server
      const error: any = new Error(result.message || 'Đăng ký thất bại');
      error.response = {
        data: result,
        status: response.status
      };
      throw error;
    }

    return result;
  },

  // (Tùy chọn) Hàm Đăng xuất dùng cho nút Đăng xuất trên Header sau này
  logout: () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser'); // Xóa cả currentUser để đồng bộ UI
    window.location.reload(); // Tải lại trang để xóa giao diện đăng nhập
  }
};

export default authService;