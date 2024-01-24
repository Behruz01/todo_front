import React, { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { apiRoot } from "../API/BASE_URL";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TodoItem() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [OneId, setOneId] = useState("");
  const [Onedata, setOneData] = useState([]);
  const titleRef = useRef();
  const descriptionRef = useRef();
  const edittitleRef = useRef();
  const editdescriptionRef = useRef();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const getTodos = async () => {
    try {
      const response = await apiRoot.get("/todo");
      setData(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!titleRef.current.value || !descriptionRef.current.value) {
      return toast.error("Title and description not be empty!");
    }
    const data = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
    };

    try {
      const response = await apiRoot.post("/todo", data);
      if (response.status === 201) {
        toast.success("Successfully created todo");
        closeModal();
        getTodos();
        titleRef.current.value = "";
        descriptionRef.current.value = "";
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const GetOne = async (id) => {
    try {
      const response = await apiRoot.get(`/todo/${id}`);
      openModal();
      if (response?.status === 200) {
        setOneId(id);
        setOneData(response?.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editFunc = async (evt) => {
    evt.preventDefault();

    const data = {
      title: edittitleRef.current.value || Onedata?.title,
      description: editdescriptionRef.current.value || Onedata?.description,
    };

    try {
      const response = await apiRoot.patch(`/todo/${OneId}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200) {
        toast.success("Successfully updated todos");
        closeModal();
        getTodos();
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteFunc = async (id) => {
    try {
      const response = await apiRoot.delete(`/todo/${id}`);

      if (response?.status === 200) {
        toast.success("Successfully deleted todo");
        getTodos();
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="flex items-center justify-center bg-indigo-500 h-screen">
      <ToastContainer />
      <div className="p-8 bg-blue-950  w-[500px]">
        <form onSubmit={addTask} className="flex flex-col gap-3 mb-3">
          <div className="flex justify-center items-center">
            <h1 className="text-white font-serif text-3xl">Get Things Done!</h1>
          </div>
          <input
            type="text"
            ref={titleRef}
            className="p-3 w-full rounded bg-transparent border border-indigo-600 active:border-indigo-900 text-white focus:outline-none"
            placeholder="Write title"
          />
          <input
            type="text"
            ref={descriptionRef}
            className="p-3 w-full rounded bg-transparent border border-indigo-600 active:border-indigo-900 text-white focus:outline-none"
            placeholder="Write description"
          />
          <button
            type="submit"
            className="p-3 bg-indigo-500 rounded-md text-white hover:bg-indigo-700 focus:outline-none"
          >
            Add Task
          </button>
        </form>
        <div>
          {data.map((task) => (
            <div
              key={task.id}
              className="bg-indigo-500 p-4 rounded-md shadow-md mb-4 flex justify-between items-center"
            >
              <div>
                <p className="text-lg text-white">{task.title}</p>
                <p className="text-white">{task.description}</p>
              </div>
              <div className="flex gap-4">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit
                    className="text-white"
                    onClick={() => {
                      GetOne(task?.id);
                      setOneId(task?.id);
                    }}
                  />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    deleteFunc(task?.id);
                  }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <form onSubmit={editFunc} className="bg-white p-8 rounded-md w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
            <input
              type="text"
              defaultValue={Onedata?.title}
              ref={edittitleRef}
              className="p-2 mb-2 w-full border border-gray-400 rounded"
              placeholder="Title"
            />
            <input
              type="text"
              defaultValue={Onedata?.description}
              ref={editdescriptionRef}
              className="p-2 mb-4 w-full border border-gray-400 rounded"
              placeholder="Description"
            />
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded"
              type="submit"
            >
              Save
            </button>
            <button
              className="ml-2 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TodoItem;
