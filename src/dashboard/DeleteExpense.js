import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteExpense = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expenseTitle, setExpenseTitle] = useState("");

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/expenses/${id}/`);
                setExpenseTitle(response.data.title);
            } catch (error) {
                alert("Error fetching expense details");
            }
        };
        fetchExpense();
    }, [id]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8000/api/expenses/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Expense deleted successfully");
            navigate("/dashboard");
        } catch (error) {
            alert("Error deleting expense");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4 text-center">
                        <h2 className="text-danger">Delete Expense</h2>
                        <p className="mt-3">Are you sure you want to delete the expense <strong>{expenseTitle}</strong>?</p>
                        <div className="d-flex justify-content-center mt-4">
                            <button className="btn btn-danger me-3" onClick={handleDelete}>
                                Yes, Delete
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteExpense;
