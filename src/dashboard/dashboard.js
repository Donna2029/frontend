import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const expensesPerPage = 5;
    const [loading, setLoading] = useState(false);

    const [monthFilter, setMonthFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/expenses/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data && Array.isArray(response.data)) {
                setExpenses(response.data);
            } else {
                setExpenses([]);
            }
        } catch (error) {
            toast.error("Error fetching expenses");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleMonthChange = (e) => {
        setMonthFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);
    };

    const filterByMonthAndCategory = (expense) => {
        const matchesMonth = monthFilter
            ? new Date(expense.date).getMonth() + 1 === parseInt(monthFilter)
            : true;
        const matchesCategory = categoryFilter
            ? expense.category === categoryFilter
            : true;
        return matchesMonth && matchesCategory;
    };

    const filteredExpenses = expenses
        .filter(filterByMonthAndCategory)
        .filter((expense) =>
            (expense?.title?.toLowerCase() || "").includes(searchTerm) ||
            (expense?.amount?.toString() || "").includes(searchTerm)
        );

    const indexOfLastExpense = currentPage * expensesPerPage;
    const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
    const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);
    const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

    const calculateSummary = () => {
        let total = 0;
        const categoryWise = {};

        expenses.forEach((exp) => {
            const amount = parseFloat(exp.amount) || 0;
            const category = exp.category || "Unknown";

            total += amount;
            if (categoryWise[category]) {
                categoryWise[category] += amount;
            } else {
                categoryWise[category] = amount;
            }
        });

        return { total, categoryWise };
    };

    const { total, categoryWise } = calculateSummary();

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-center m-0">Expense Tracker Dashboard</h2>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Add Expense */}
            <div className="mb-3 text-end">
                <Link to="/add-expense" className="btn btn-success">
                    Add Expense
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Search by title or amount"
                        className="form-control"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="col-md-4">
                    <select className="form-select" value={monthFilter} onChange={handleMonthChange}>
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <select className="form-select" value={categoryFilter} onChange={handleCategoryChange}>
                        <option value="">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Rent">Rent</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Travel">Travel</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>

            {/* Summary Section */}
            <div className="card p-3 mb-4">
                <h4>Summary</h4>
                <p>
                    <strong>Total Spent:</strong> ₹{total.toFixed(2)}
                </p>
                <div className="row">
                    {Object.entries(categoryWise).map(([category, amount]) => (
                        <div key={category} className="col-md-3 mb-2">
                            <div className="p-2 border rounded text-center">
                                <strong>{category}</strong>: ₹{amount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading Spinner */}
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="card p-3 mb-4">
                    <h3>Expenses</h3>
                    {currentExpenses.length === 0 ? (
                        <p className="text-center">No expenses found.</p>
                    ) : (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>S.no</th>
                                    <th>Title</th>
                                    <th>Amount (₹)</th>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentExpenses.map((expense, index) => {
                                    const amount = parseFloat(expense.amount);
                                    const formattedAmount = isNaN(amount) ? "0.00" : amount.toFixed(2);
                                    const title = expense.title || "No Title";
                                    const date = expense.date
                                        ? new Date(expense.date).toLocaleDateString()
                                        : "N/A";
                                    const category = expense.category || "Unknown";

                                    return (
                                        <tr key={expense.id || index}>
                                            <td>{indexOfFirstExpense + index + 1}</td>
                                            <td>{title}</td>
                                            <td>₹{formattedAmount}</td>
                                            <td>{date}</td>
                                            <td>{category}</td>
                                            <td>
                                                <Link
                                                    to={`/edit-expense/${expense.id}`}
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    to={`/delete-expense/${expense.id}`}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                            <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="align-self-center">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
