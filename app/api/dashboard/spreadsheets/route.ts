import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

function isAllowedSpreadsheet(fileName: string): boolean {
  const lowerName = fileName.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uploads = await prisma.spreadsheetUpload.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      originalName: true,
      fileSize: true,
      sheetName: true,
      rowCount: true,
      columnCount: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ uploads });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!isAllowedSpreadsheet(file.name)) {
    return NextResponse.json(
      { error: "Only .xlsx, .xls, and .csv files are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size must be 10MB or less" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return NextResponse.json(
        { error: "Spreadsheet has no sheets" },
        { status: 400 }
      );
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
      header: 1,
      raw: false,
      defval: "",
    });

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Spreadsheet is empty" },
        { status: 400 }
      );
    }

    const headerRow = (rows[0] ?? []).map((cell) => String(cell).trim());
    const dataRows = rows
      .slice(1)
      .filter((row) => row.some((cell) => String(cell).trim() !== ""));

    const columnCount = Math.max(
      headerRow.length,
      ...dataRows.map((row) => row.length),
      0
    );

    const previewRows = dataRows.slice(0, 15).map((row) =>
      row.slice(0, 30).map((cell) => String(cell).trim())
    );

    const upload = await prisma.spreadsheetUpload.create({
      data: {
        userId: session.user.id,
        originalName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        sheetName: firstSheetName,
        rowCount: dataRows.length,
        columnCount,
        headers: headerRow,
        previewRows,
      },
      select: {
        id: true,
        originalName: true,
        sheetName: true,
        rowCount: true,
        columnCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ upload });
  } catch (error) {
    console.error("Spreadsheet upload failed:", error);
    return NextResponse.json(
      { error: "Unable to parse spreadsheet file" },
      { status: 400 }
    );
  }
}
