import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [seen, setSeen] = useState(false);
  //getUsers
  const getDoctors = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/v1/admin/getAllDoctors`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        const data=[...res.data.data].reverse();
        setDoctors(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/admin/changeAccountStatus`,
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        setSeen(!seen);
        // window.location.reload();
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, [seen]);

  const columns = [
    {
      title: <div className="text-sm md:text-base">Name</div>,
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: <div className="text-sm md:text-base">Status</div>,
      dataIndex: "status",
    },
    {
      title: <div className="text-sm md:text-base">Phone</div>,
      dataIndex: "phone",
    },
    {
      title: <div className="text-sm md:text-base">Actions</div>,
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <div className="flex justify-center">
              <button
                className="btn btn-success mr-2"
                onClick={() => handleAccountStatus(record, "approved")}
              >
                Approve
              </button>

              <button
                className="btn btn-danger"
                onClick={() => handleAccountStatus(record, "rejected")}
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="text-sm md:text-base text-center">Reviewed</div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="text-center m-3 text-xl md:text-3xl p-4">All Doctors</h1>
      <Table className="overflow-x-auto" columns={columns} dataSource={doctors} pagination={{pageSize:7}}/>
    </Layout>
  );
};

export default Doctors;
