class ServiceAgreementReport {
    constructor() {
        // We need a stream for the report to be generated to...
        const pipeStream = new fluentReports.BlobStream();

        const rpt = new fluentReports.Report(pipeStream)
            .titleheader(this.titleheader)
            .pageHeader(this.header)
            .groupBy( "Month" )
            .header(this.MonthHeader)
            .groupBy( "Day" )
            .header(this.DayHeader)
            .groupBy("ExternalTranID")
            .header(this.TransactionHeader)
            .data(reportData)
            .detail(this.detail)
            .pageFooter(this.footer);

        // Optional Debug output is always nice (to help you see the structure of the report in the console)
        // rpt.printStructure(true);

        // console.time("Rendered");

        // // This does the MAGIC...  :-)
        // rpt.render(function (err, stream) {
        //     console.timeEnd("Rendered");
        //     displayReport(err, stream);
        // });

        // You can also just do this below rather than adding the additional code above which outputs to the console how much time it took to render the report
        rpt.render(displayReport);
        return rpt;

    }

    // methods
    // These are the function that will be run to generate the report.
    detail = function(x, r, s){
        x.band([
            {data: r.Quantity, width: 20, align: 1},
            {data: r.ProductName, width: 200},
            {data: r.Discounted, width: 150}
        ], {x: 100, border: 1, width: 0});

    };
    titleheader = function(rpt){
        rpt.print("Service Agreements", {align: "center", fontSize: 13, fontBold: true})
        rpt.newLine()
        
    }
    header = function(rpt){
        rpt.print("Service Agreements", {align: "center", fontSize: 13, fontBold: true})
        rpt.newLine()
        
    }

    MonthHeader = function(x, r){
        x.newLine(2)
        x.fontBold();
        x.band([
            {data: r.Month + ", " + r.Year, width: x.maxX()-68,fontBold: true }
        ], {x: 0});
        x.fontNormal();
        x.bandLine(1);
    };
    DayHeader = function(x, r){
        x.newline()
        x.fontBold();
        x.band([
            {data: 'Day: ' + r.Day, width: 175,fontBold: true, align: 1 }
        ], {x: 0});
        x.fontNormal();
        x.bandLine(1);
    };
    TransactionHeader = function(x, r){
        if (r.FirstName) {
            x.band([
                {data: r.FirstName + ' ' + r.LastName, width: 150}
            ], {x: 20});
        }
        if (r.CompanyName) {
            x.band([{data: r.CompanyName, width: 150}], {x: 20});
        }
        if (r.Address) {
            x.band([{data: r.Address, width: 150}], {x: 20});
        }
        if (r.City) {
            x.band([{data: r.City + ", " + r.State + " " + r.Zip, width: 150}], {x: 20});
        }
        x.newline();
    };
    footer = (rpt) => {
        rpt.newLine()

        rpt.line(rpt.currentX(), rpt.maxY()-18, rpt.maxX(), rpt.maxY()-18);
        rpt.pageNumber({text: "Page {0} of {1}", footer: true, align: "right"});
        rpt.printedAt({text: "Printed {3} At: {0}:{1}{2} ", footer: true, align: "left"});
    }
}

class ByCategoryReport{
    constructor(){
                // We need a stream for the report to be generated to...
                const pipeStream = new fluentReports.BlobStream();

                // Tell the engine we are saving rendering it to a stream...
                const rpt = new fluentReports.Report(pipeStream)
                    .margins(70)
                        .autoPrint(false) // Optional
                        .titleheader(this.titleheader)
                        .pageHeader(this.header)
                        .pageFooter(this.footer) // Optional
                        .data( reportData )	// REQUIRED
                        .totalFormatter( this.totalFormatter ) // Optional
        
                        rpt.groupBy( "Month" )
                        .header(this.MonthHeader)
        
                        rpt.groupBy( "Category" )
                        .footer(this.CategoryFooter)
                        .max("Category")
                        .sum('Quantity')
                        .sum('TotalRetail')
        
        
                // Optional Debug output is always nice (to help you see the structure of the report in the console)
                // rpt.printStructure(true);
        
        
                // console.time("Rendered");
        
                // This does the MAGIC...  :-)
                // rpt.render(function(err, stream) {
                //     console.timeEnd("Rendered");
                //     displayReport(err, stream);
                // });
        
                // You can also just do this below rather than adding the additional code above which outputs to the console how much time it took to render the report
                rpt.render(displayReport);
                return rpt;
    }
    titleheader = function(rpt){
        rpt.print("USFT Web Sales", {align: "center", fontSize: 13, fontBold: true})
        rpt.newLine()
        
    }
    header = function(rpt){
        rpt.print("USFT Web Sales", {align: "center", fontSize: 13, fontBold: true})
        rpt.newLine()
        
        
    }
    MonthHeader = function(x, r){
        x.newLine(2)
        x.fontBold();
        x.band([
            {data: r.Month + ", " + r.Year, width: x.maxX()-68,fontBold: true }
        ], {x: 0});
        x.fontNormal();
        x.band([
            {data: 'Category', width: 190},
            {data: 'Items sold', width: 60, align: 3},
            {data: 'Net sales', width: 200, align: 3}
        ], {x: 0});  // , font: "AldotheApache"});
        x.bandLine(1);
    };
    CategoryFooter = function (r,d) {
        r.band([
            [d.Category, 190],
            [r.totals.Quantity, 60, 2],
            [r.totals.TotalRetail, 200, 3],
     ]);
     r.newLine()
        };


    detail = function(x, r, s){
        x.band([
            {data: r.Category, width: 200},
            {data: r.Quantity, width: 20, align: 1},
            {data: r.TotalRetail, width: 150}
        ], { border: 1, width: 0});

    };
    totalFormatter = function(data, callback) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === 'Quantity') {
                    continue;
                }
                // Simple Stupid Money formatter.  It is fairly dumb.  ;-)
                let money = data[key].toString();
                const idx = money.indexOf('.');
                if (idx === -1) {
                    money += ".00";
                } else if (idx === money.length - 2) {
                    money += "0";
                }
                for (let i = 6; i < money.length; i += 4) {
                    money = money.substring(0, money.length - i) + "," + money.substring(money.length - i);
                }

                data[key] = '$ ' + money;

            }
        }

        callback(null, data);
    };



    footer = (rpt) => {
        rpt.line(rpt.currentX(), rpt.maxY()-18, rpt.maxX(), rpt.maxY()-18);
        rpt.newLine()
        rpt.pageNumber({text: "Page {0} of {1}", footer: true, align: "right"});
        rpt.printedAt({text: "Printed {3} At: {0}:{1}{2} ", footer: true, align: "left"});
    }

}