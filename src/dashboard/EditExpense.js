import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditExpense = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [notes, setNotes] = useState("");
    const [categories, setCategories] = useState([
        'Food', 'Rent', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Others'
    ]);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const expRes = await axios.get(`http://localhost:8000/api/expenses/${id}/`);
                setTitle(expRes.data.title);
                setAmount(expRes.data.amount);
                setDate(expRes.data.date);
                setCategory(expRes.data.category);
                setNotes(expRes.data.notes);
            } catch (error) {
                alert("Error fetching expense details");
            }
        };
        fetchExpense();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8000/api/expenses/${id}/`,
                {
                    title,
                    amount,
                    date,
                    category,
                    notes
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert("Expense updated successfully");
            navigate("/dashboard");
        } catch (error) {
            alert("Error updating expense");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Edit Expense</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter expense title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Optional notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-success w-100">
                                Update Expense
                            </button>
                            <div className="text-center mt-3">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditExpense;
