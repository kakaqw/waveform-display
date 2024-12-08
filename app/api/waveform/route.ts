import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { waveform, filename } = await request.json();

    // 将 base64 图片数据转换为 Buffer
    const base64Data = waveform.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), "uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // 生成唯一文件名
    const timestamp = new Date().getTime();
    const uniqueFilename = `waveform_${timestamp}.png`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // 保存文件
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: "波形图保存成功",
      path: filePath,
    });
  } catch (error) {
    console.error("保存波形图时出错:", error);
    return NextResponse.json(
      { success: false, message: "保存波形图失败" },
      { status: 500 }
    );
  }
}
