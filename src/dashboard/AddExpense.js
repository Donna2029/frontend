import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [notes, setNotes] = useState("");
    const [categories] = useState([
        'Food', 'Rent', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Others'
    ]);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access");
            await axios.post(
                "http://localhost:8000/api/expenses/",
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
            alert("Expense Added Successfully");
            navigate("/dashboard");
        } catch (error) {
            alert("Error adding expense");
            console.error("Error adding expense:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Add Expense</h2>
                        <form onSubmit={handleSubmit}>
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
                            <button type="submit" className="btn btn-primary w-100 mb-3">
                                Add Expense
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary w-100"
                                style={{ marginTop: "10px" }}
                                onClick={() => navigate("/dashboard")}
                            >
                                Return to Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;
