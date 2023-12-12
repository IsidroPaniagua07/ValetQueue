import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import "./index.css";
import boopSfx from "/boop.mp3";

const Index = () => {
  const inputRef = useRef(null);
  const [employees, setEmployees] = useState(new Array(10).fill(null));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [playActive] = useSound(boopSfx, { volume: 1 });
  const handleSubmit = (e) => {
    e.preventDefault();
    playActive();
    const inputData = inputRef.current.value;
    const employeeId = inputData.slice(0, 9);
    const regex = /^\d{9}$/;
    if (!regex.test(employeeId)) return (inputRef.current.value = "");
    inputRef.current.disabled = true;
    console.log(employeeId);
    (async () => {
      const response = await fetch(
        `http://localhost:8080/api/insertuser/${employeeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      const { status, action, data } = res;
      console.log(data);
      if (status === "error") return alert(error);
      if (action === "insert") {
        setEmployees([...employees, data]);
      } else if (action === "update") {
        const newEmployees = employees.filter(
          (obj) => obj.employee_id !== data.employee_id
        );
        setEmployees(newEmployees);
      }
    })();
    inputRef.current.value = "";
    inputRef.current.disabled = false;
    inputRef.current.focus();
  };

  const colorOptions = ["#D8D8D8", "#FFFFFF"];

  const getTime = (timeStamp) => {
    const date = new Date(timeStamp);
    date.setHours(date.getHours() + 8);

    const timeDiff = ((currentDate - date) / 1000 / 60).toFixed(0);
    return timeDiff;
  };
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8080/api/getusers");
      const data = await response.json();
      data.sort((a, b) => new Date(a.time_stamp) - new Date(b.time_stamp));
      setEmployees(data);
      console.log("Fetching data...");
    }
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col h-full w-full ">
      <div className="flex flex-row h-[1%] w-full justify-center items-center ">
        {/* <div className="text-5xl">Q</div> */}
        <form>
          <input
            id="inputBar"
            type="number"
            ref={inputRef}
            className="border border-black opacity-0"
            placeholder="Employee ID"
            onBlur={(e) => e.target.focus()}
            autoFocus
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="opacity-0 cursor-auto"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="flex h-full w-full justify-center items-center ">
        <div className="flex flex-col border h-[98%] w-[95%] border-black rounded-xl ">
          <div className="flex h-[10%] flex-row pl-4 font-mono justify-center items-center text-2xl bg-[#289B9E] rounded-t-xl border-b border-black">
            <span className=" text-center w-[70%]">Employee</span>
            <span className="text-center w-[30%]">Minutes Elapsed</span>
          </div>
          {employees[0]
            ? employees.map((obj, index) => {
                if (getTime(obj.time_stamp) >= 15) {
                  return (
                    <div
                      key={index}
                      className={`flex h-[10%] bg-red-500 flex-row justify-center items-center text-3xl`}
                    >
                      <span className="text-left pl-20 w-[70%]">
                        {`${obj.employee_id} - ${obj.first_name} ${obj.last_name}`}
                      </span>
                      <span className="text-center w-[30%]">
                        {Math.max(0, getTime(obj.time_stamp))}
                      </span>
                    </div>
                  );
                }
                if (index % 2 === 0) {
                  return (
                    <div
                      key={index}
                      className={`flex h-[10%] flex-row justify-center  items-center text-3xl`}
                    >
                      <span className="text-left pl-20 w-[70%]">
                        {`${obj.employee_id} - ${obj.first_name} ${obj.last_name}`}
                      </span>
                      <span className="text-center w-[30%]">
                        {Math.max(0, getTime(obj.time_stamp))}
                      </span>
                    </div>
                  );
                }
                if (index % 2 === 1) {
                  return (
                    <div
                      key={index}
                      className={`flex h-[10%] bg-red flex-row justify-center bg-[#D8D8D8] items-center text-3xl`}
                    >
                      <span className="text-left pl-20 w-[70%]">
                        {`${obj.employee_id} - ${obj.first_name} ${obj.last_name}`}
                      </span>
                      <span className="text-center w-[30%]">
                        {Math.max(0, getTime(obj.time_stamp))}
                      </span>
                    </div>
                  );
                }
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Index;
