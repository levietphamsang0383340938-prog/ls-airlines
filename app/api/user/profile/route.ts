import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { 
      userId, 
      title, 
      lastName, 
      middleName, 
      firstName, 
      displayName, 
      gender, 
      dateOfBirth, 
      nationality, 
      language,
      idNumber,
      idIssuePlace,
      idIssueDate,
      company,
      addressDetails,
      address,
      province,
      ward,
      postalCode,
      email,
      phoneNumber
    } = body;

    if (!userId) {
      return NextResponse.json({ message: "Không tìm thấy thông tin định danh." }, { status: 400 });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (lastName) updateData.lastName = lastName;
    if (middleName !== undefined) updateData.middleName = middleName;
    if (firstName) updateData.firstName = firstName;
    if (displayName) updateData.displayName = displayName;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (nationality) updateData.nationality = nationality;
    if (language) updateData.language = language;
    if (idNumber !== undefined) updateData.idNumber = idNumber;
    if (idIssuePlace !== undefined) updateData.idIssuePlace = idIssuePlace;
    if (idIssueDate) updateData.idIssueDate = new Date(idIssueDate);
    if (company !== undefined) updateData.company = company;
    if (addressDetails !== undefined) updateData.addressDetails = addressDetails;
    if (address !== undefined) updateData.address = address;
    if (province !== undefined) updateData.province = province;
    if (ward !== undefined) updateData.ward = ward;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: "Không tìm thấy người dùng." }, { status: 404 });
    }

    const userForResponse = {
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone || updatedUser.fullPhone || updatedUser.phoneNumber,
      role: updatedUser.role,
      walletBalance: updatedUser.walletBalance || 0,
      dateOfBirth: updatedUser.dateOfBirth,
      idNumber: updatedUser.idNumber || "",
      gender: updatedUser.gender,
      title: updatedUser.title,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      middleName: updatedUser.middleName,
      displayName: updatedUser.displayName,
      nationality: updatedUser.nationality,
      language: updatedUser.language,
      idIssuePlace: updatedUser.idIssuePlace,
      idIssueDate: updatedUser.idIssueDate,
      company: updatedUser.company,
      addressDetails: updatedUser.addressDetails,
      address: updatedUser.address,
      province: updatedUser.province,
      ward: updatedUser.ward,
      postalCode: updatedUser.postalCode,
      phoneNumber: updatedUser.phoneNumber
    };

    return NextResponse.json(
      { message: "Cập nhật thành công!", user: userForResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("LỖI CẬP NHẬT THÔNG TIN:", error);
    return NextResponse.json(
      { message: "Đã có lỗi xảy ra khi lưu thông tin." },
      { status: 500 }
    );
  }
}
