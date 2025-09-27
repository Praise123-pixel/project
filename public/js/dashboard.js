// ---------------------- API Endpoints for Dashboard ----------------------

// GET /api/dashboard/summary
router.get("/api/dashboard/summary", async (req, res) => {
  try {
    const totalStockItems = await StockModel.countDocuments();
    const salesToday = await salesModel.countDocuments({
      saleDate: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const salesThisMonth = await salesModel.countDocuments({
      saleDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });
    const lowStockCount = await StockModel.countDocuments({
      quantity: { $lt: 5 },
    });

    res.json({ totalStockItems, salesToday, salesThisMonth, lowStockCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});

// GET /api/sales?limit=5
router.get("/api/sales", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const recentSales = await salesModel
      .find()
      .sort({ saleDate: -1 })
      .limit(limit)
      .populate("salesAgent", "firstName lastName");

    const formatted = recentSales.map((s) => ({
      id: s._id,
      customerName: s.customerName,
      productName: s.productName,
      quantity: s.quantity,
      total: s.totalPrice,
      saleDate: s.saleDate,
      salesAgent: s.salesAgent
        ? `${s.salesAgent.firstName} ${s.salesAgent.lastName}`
        : "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent sales" });
  }
});

// GET /api/inventory/low
router.get("/api/inventory/low", async (req, res) => {
  try {
    const lowItems = await StockModel.find({ quantity: { $lt: 5 } });
    const formatted = lowItems.map((item) => ({
      id: item._id,
      productName: item.productName,
      quantity: item.quantity,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch low stock items" });
  }
});

// Optional: API endpoints for charts
router.get("/api/reports/sales/daily", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await salesModel.aggregate([
      { $match: { saleDate: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      labels: data.map((d) => d._id),
      data: data.map((d) => d.total),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sales trend" });
  }
});

router.get("/api/reports/stock/composition", async (req, res) => {
  try {
    const data = await StockModel.aggregate([
      { $group: { _id: "$productType", total: { $sum: "$quantity" } } },
    ]);

    res.json({
      labels: data.map((d) => d._id),
      data: data.map((d) => d.total),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stock composition" });
  }
});
