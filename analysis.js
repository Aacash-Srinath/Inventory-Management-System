// Fetching Data to be displayed in the Inventory Statistics Cards
$.ajax({
    url: 'get_totalProd.php', 
    method: 'GET', 
    dataType: 'json', 
    success: function(data) {
        const totalProdBody = document.getElementById('prodNumber');
        totalProdBody.innerText = `${data[0][0].total}`;

        const stockNumber = document.getElementById('stockNumber');
        stockNumber.innerText = `${data[1][0].stocked}`;

        const upcomingstockNumber = document.getElementById('upcomingStockNumber');
        upcomingstockNumber.innerText = `${data[2][0].upcomingStock}`;

        const upcomingRestockNumber = document.getElementById('upcomingRestockNumber');
        upcomingRestockNumber.innerText = `${data[3][0].upcomingRestock}`;
    },
    error: function(error) {
        console.error('Error Fetching Data:', error);
    }
});


// Fetching Data & Performing Actions for the Shipping Status Pie Chart
$.ajax({
    url: 'analysis_chart.php', 
    method: 'GET', 
    dataType: 'json', 
    success: function(data) {

        function showPopup(label, data) {
            $('#shippingStatusTable').DataTable({
                ajax: {
                    url: 'get_shippingStatus.php', 
                    data: { shipping: label },
                    method: "GET",
                    datatype: "json", 
                    contentType: "application/json; charset=UTF-8",
                    processing: true,
                    serverSide: true,
                    dataSrc: ''
                },
                columns: [
                    { data: 'serialNo' },
                    { data: 'batchId' },
                    { data: 'productId' },
                    { data: 'stockingDate' },
                    { data: 'nextRestock' },
                    { data: 'manufacturingDate' },
                    { data: 'shippingCompany' },
                    { data: 'quantity' },
                ]
            });
            
            const modal_header = document.getElementById('modalHeader1');
            modal_header.innerText = label + " Products";
            modal_header.style.fontWeight = 700;
            $("#shippingModal").modal("show");
        }

        function handlePieChartClick(event, chartElements) {
            if (chartElements && chartElements.length > 0) {

                // Get the clicked segment index
                const segmentIndex = chartElements[0].index;

                // Retrieve data for the clicked segment
                const segmentData = orderStatusChart.data.datasets[0].data[segmentIndex];
                const segmentLabel = orderStatusChart.data.labels[segmentIndex];

                // Show a popup or tooltip with segment details
                showPopup(segmentLabel, segmentData);
            }

            const cancelButton = document.getElementById('cancelButton1');
            cancelButton.addEventListener('click', () => {
                $('#shippingStatusTable').DataTable().destroy();
            })

            const closeButton = document.getElementById('closeButton1');
            closeButton.addEventListener('click', () => {
                $('#shippingStatusTable').DataTable().destroy();
            })
        }

        // Chart 1: Shipping Status
        const orderStatusChart = new Chart(document.getElementById('orderStatusChart'), {
            type: 'pie',
            data: {
                labels: ['Delivered', 'In Transit', 'Pending'],
                datasets: [{
                    data: [data[0]['Count'], data[1]['Count'], data[2]['Count']],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545']
                }]
            },
            options: {
                onClick: handlePieChartClick
            }
        });
    },
    error: function(error) {
        console.error('Error fetching data:', error);
    }
});

// Fetching Data & Performing Actions for the Inventory Dates Bar Graph
$.ajax({
    url: 'analysis_graph.php', 
    method: 'GET', 
    dataType: 'json',
    success: function(data) {

        // Extract data from the response
        const stockData = data[0];
        const restockData = data[1];
        const manufacturingData = data[2];

        let stock = [];
        let restock = [];
        let mfr = [];
        let stockQty = [];
        let restockQty = [];
        let mfrQty = [];
        stockData.forEach(element => {
            stock.push(element['MonthYear']);                    
            stockQty.push(element['count']);                    
        });
        restockData.forEach(element => {
            restock.push(element['MonthYear']);            
            restockQty.push(element['count']);            
        });
        manufacturingData.forEach(element => {
            mfr.push(element['MonthYear']);                 
            mfrQty.push(element['count']);                 
        });

        function showPopup(label1, label2, data) {
            $('#datesTable').DataTable({
                ajax: {
                    url: 'get_invDates.php', 
                    data: { date: label2, invStatus: label1 },
                    method: "GET",
                    datatype: "json", 
                    contentType: "application/json; charset=UTF-8",
                    processing: true,
                    serverSide: true,
                    dataSrc: ''
                },
                columns: [
                    { data: 'serialNo' },
                    { data: 'batchId' },
                    { data: 'productId' },
                    { data: 'stockingDate' },
                    { data: 'nextRestock' },
                    { data: 'manufacturingDate' },
                    { data: 'shippingCompany' },
                    { data: 'shippingStatus' },
                    { data: 'quantity' },
                ]
            });
            
            const modal_header = document.getElementById('modalHeader2');
            let d = new Date(label2);
            let year = d.getFullYear();
            let month = new Intl.DateTimeFormat('en-US', {month: "long"}).format(d);
            modal_header.innerText = `Products ${label1} in ${month} ${year}`;
            modal_header.style.fontWeight = 700;
            $("#datesModal").modal("show");
        }

        function handleBarGraphClick(event, chartElements) {
            if (chartElements && chartElements.length > 0) {
                // Get the clicked segment index
                const index2 = chartElements[0].datasetIndex;
                const index1 = chartElements[0].index;

                // Retrieve data for the clicked segment
                const segmentLabel1 = inventoryStatsChart.data.datasets[index2].label;
                const segmentData = inventoryStatsChart.data.datasets[index2].data[index1];
                const segmentLabel2 = inventoryStatsChart.data.labels[index1];

                // Show a popup or tooltip with segment details
                showPopup(segmentLabel1, segmentLabel2, segmentData);

                const cancelButton = document.getElementById('cancelButton2');
                cancelButton.addEventListener('click', () => {
                    $('#datesTable').DataTable().destroy();
                })

                const closeButton = document.getElementById('closeButton2');
                closeButton.addEventListener('click', () => {
                    $('#datesTable').DataTable().destroy();
                })
            }
        }

        // Chart 2: Inventory Statistics
        const inventoryStatsChart = new Chart(document.getElementById('inventoryStatsChart'), {
            type: 'bar',
            data: {
                labels: stock, 
                datasets: [
                    {
                        label: 'Stocked',
                        data: stockQty,
                        backgroundColor: '#007bff'
                    },
                    {
                        label: 'Restock',
                        data: restockQty,
                        backgroundColor: '#28a745'
                    },
                    {
                        label: 'Manufactured',
                        data: mfrQty,
                        backgroundColor: '#ffc107'
                    }
                ]
            },
            options: {
                scales: {
                    y: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 0 
                        }
                    }],
                    x: [{
                        stacked: true 
                    }]
                },
                onClick: handleBarGraphClick
            }
        }); 
    },
    error: function(error) {
        console.error('Error fetching data:', error);
    }
});

// Fetching Data & Performing Actions for the Shipping Company Pie Chart
$.ajax({
    url: 'analysis_ship.php', 
    method: 'GET', 
    dataType: 'json', 
    success: function(data) {

        let companies = [];
        let companyOrders = []
        data.forEach(element => {
            companies.push(element['shippingCompany']);   
            companyOrders.push(element['Count']);                 
        });

        function showPopup(data) {
            $('#shipTable').DataTable({
                ajax: {
                    url: 'get_shipComp.php', 
                    data: { name: data },
                    method: "GET",
                    datatype: "json", 
                    contentType: "application/json; charset=UTF-8",
                    processing: true,
                    serverSide: true,
                    dataSrc: ''
                },
                columns: [
                    { data: 'serialNo' },
                    { data: 'batchId' },
                    { data: 'productId' },
                    { data: 'stockingDate' },
                    { data: 'nextRestock' },
                    { data: 'manufacturingDate' },
                    { data: 'shippingStatus' },
                    { data: 'quantity' },
                ]
            });

            const modal_header = document.getElementById('modalHeader3');
            modal_header.innerText = `${data}`;
            modal_header.style.fontWeight = 700;
            $("#shipModal").modal("show");
            
        }

        function handleShipChartClick(event, chartElements) {
            if (chartElements && chartElements.length > 0) {
                const index = chartElements[0].index;
                console.log(companies[index]);

                const compName = companies[index];

                showPopup(compName);

                const cancelButton = document.getElementById('cancelButton3');
                cancelButton.addEventListener('click', () => {
                    $('#shipTable').DataTable().destroy();
                })

                const closeButton = document.getElementById('closeButton3');
                closeButton.addEventListener('click', () => {
                    $('#shipTable').DataTable().destroy();
                })
            }
        }

        const shipCompChart = new Chart(document.getElementById('shipCompanyChart'), {
            type: 'pie',
            data: {
                labels: companies,
                datasets: [{
                    data: companyOrders,
                    backgroundColor: ["#3498db", "#f39c12", "#e74c3c", "#2ecc71", "#9b59b6",
                        "#1abc9c", "#e67e22", "#d35400", "#2980b9", "#8e44ad",
                        "#27ae60", "#f1c40f", "#c0392b", "#7f8c8d", "#f0e68c",
                        "#00ffff", "#008b8b", "#b8860b", "#a9a9a9", "#006400",
                        "#bdb76b", "#8b008b", "#556b2f", "#ff8c00", "#9932cc",
                        "#8b0000", "#e9967a", "#8fbc8f", "#483d8b", "#2f4f4f",
                        "#00ced1", "#9400d3", "#ff00ff", "#ff4500", "#da70d6",
                        "#ff69b4", "#8a2be2", "#7fff00", "#ff7f50", "#6495ed",
                        "#fff8dc", "#dc143c", "#00ffff", "#00008b", "#008b8b",
                        "#b8860b", "#a9a9a9", "#006400", "#bdb76b", "#8b008b",
                        "#556b2f", "#ff8c00", "#9932cc", "#8b0000", "#e9967a"]
                }]
            },
            options: {
                onClick: handleShipChartClick
            }
        });
    },
    error: function(error) {
        console.error('Error fetching data:', error);
    }
});

// Constraints for using the Search Bar
const searchForm = document.querySelector("form");
const searchBar = document.getElementById("search-bar");
searchForm.addEventListener("submit", function (event) {
    if (searchBar.value.trim() == "") {
        // The search bar is empty, show an alert
        alert("Enter a Search Value!!");
        event.preventDefault(); // Prevent the form from submitting
    } else {
        window.location.href = "search.html";
    }
});