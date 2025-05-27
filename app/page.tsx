import FileUploader from "@/components/file/FileUploader";
import Header from "@/components/shared/Header";
import Info from "@/components/shared/Info";

export default function Home() {
  return (
    <div className="flex flex-col max-w-xl w-full items-center gap-3 px-4">
      <Header />
      <div className="grid gap-4">
        <Info />
        <FileUploader />
      </div>
    </div>
  );
}
