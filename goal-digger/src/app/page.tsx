import Footer from "@/app/components/Footer";
import TaskManager from "./components/TaskManager";



export default function Home() {
  return ( 
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>
          <span className="text-4xl font-bold">Goal Digger</span>
          <span className="text-lg text-gray-500">Your personal task manager</span>
        </h1>
      
        <TaskManager />

      </main>
      
      <Footer />
    </div>
  );
}
