class ServiceAgreementReport {
    constructor() {
        // We need a stream for the report to be generated to...
        const pipeStream = new fluentReports.BlobStream();

        if(reportData.length === 0){
            const rpt = new fluentReports.Report(pipeStream,({fontSize: 9}))
            .margins(40)
                .pageHeader(this.nodata)
                .data(reportData)
            rpt.render(displayReport);
            return rpt;
        }else{
            const rpt = new fluentReports.Report(pipeStream,({fontSize: 9}))
            .margins(40)
                // .titleheader(this.titleheader)
                .pageHeader(this.header)
                .data(reportData)
                .detail(this.detail)
                .count('Discounted')
                .finalSummary(this.finalSummary)// Optional

                rpt.groupBy( "Month" )
                .header(this.MonthHeader)
                .count('Discounted')
                .footer(this.MonthFooter)

                rpt.groupBy( "Day" )
                .header(this.DayHeader)

                rpt.groupBy("ExternalTranID")
                .header(this.TransactionHeader)

            rpt.render(displayReport);
            return rpt;

        }

            
            // .pageFooter(this.footer);

        // Optional Debug output is always nice (to help you see the structure of the report in the console)
        // rpt.printStructure(true);

        // console.time("Rendered");

        // // This does the MAGIC...  :-)
        // rpt.render(function (err, stream) {
        //     console.timeEnd("Rendered");
        //     displayReport(err, stream);
        // });

        // You can also just do this below rather than adding the additional code above which outputs to the console how much time it took to render the report

    }

    // methods
    // These are the function that will be run to generate the report.
    nodata = function(rpt){
        rpt.pageNumber({text: "Page {0} of {1}",  align: "right"});
        rpt.printedAt({text: "Printed {3} At: {0}:{1}{2} ",  align: "left"});
        rpt.newLine(3)
        rpt.print("USFT Service Agreements", {align: "center", fontSize: 13, fontBold: true})
        rpt.newLine(3)
        rpt.print("No Service Agreements sold for selected date range", {align: "center", fontSize: 13, fontBold: true})
        
        // x.band([
        //     {data: "No Service Agreements", width: 45, align: 1},
        // ], {x: 40, border: 1, width: 0});
        
    }

    detail = function(x, r, s){
        x.band([
            {data: r.Quantity, width: 45, align: 1},
            {data: r.ProductName, width: 270},
            {data: r.Discounted, width: 135}
        ], {x: 40, border: 1, width: 0});

    };
    titleheader = function(rpt){
        rpt.print("Service Agreements", {align: "center", fontSize: 13, fontBold: true})
        rpt.newLine()
        
    }
    header = function(rpt, d){
        rpt.pageNumber({text: "Page {0} of {1}",  align: "right"});
        rpt.printedAt({text: "Printed {3} At: {0}:{1}{2} ",  align: "left"});
        rpt.newLine(3)
        rpt.print("USFT Service Agreements", {align: "center", fontSize: 13, fontBold: true})
        // rpt.print(`${d.StartDate} to ${d.EndDate}`, {align: "center", fontSize: 13, fontBold: true})

    }

    MonthHeader = function(x, r){
        x.newLine(2)
        x.fontBold();
        x.band([
            {data: r.Month + ", " + r.Year, width: 470,fontBold: true }
        ], {x: 30});
        x.fontNormal();
        x.bandLine(1);


    };
    MonthFooter = function (r,d) {
        r.newLine()
        r.bandLine(1);

        r.band([
            // [d.Category, 270],
            // ["Total items:  " + r.totals.Quantity, 315, 3],
            // ["Total sales:  " + r.totals.TotalRetail, 155, 3],
            {data: "Total Agreements for " + d.Month + ":  " + r.totals.Discounted, width: 1000, align: 1},
            // {data: "Total sales:  " + r.totals.TotalRetail, width: 155, align: 3},
        ], {x: 40});
        r.newLine()

    };

    DayHeader = function(x, r){
        x.newline()
        x.fontBold();
        x.band([
            {data: 'Day: ' + r.Day, width: 450,fontBold: true, align: 1 }
        ], {x: 40});
        x.fontNormal();
        x.bandLine(1);


    };
    TransactionHeader = function(x, r){
        x.newline()
        if (r.FirstName) {
            x.band([
                {data: r.FirstName + ' ' + r.LastName, width: 150},
                {data: `Phone: ${r.Phone}`, width: 110},
                {data: `Email: ${r.Email}`, width: 190}
            ], {x: 50});
        }
        if (r.CompanyName) {
            x.band([{data: r.CompanyName, width: 150}], {x: 50});
        }
        if (r.Address) {
            x.band([{data: r.Address, width: 150}], {x: 50});
        }
        if (r.City) {
            x.band([{data: r.City + ", " + r.State + " " + r.Zip, width: 150}], {x: 50});
        }
        x.newline();

    };
    footer = (rpt) => {
        rpt.newLine()

        rpt.line(rpt.currentX(), rpt.maxY()-18, rpt.maxX(), rpt.maxY()-18);
        rpt.pageNumber({text: "Page {0} of {1}", footer: true, align: "right"});
        rpt.printedAt({text: "Printed {3} At: {0}:{1}{2} ", footer: true, align: "left"});
    }
    finalSummary = (rpt) => {
        rpt.band([
            {data: '' , width: 470,fontBold: true, align: 1 }
        ], {x: 30});

        rpt.newLine(3)
        rpt.bandLine(1);
        // rpt.newLine()
        rpt.bandLine(1,3);

        rpt.band([
            // ["Total items:  " + rpt.totals.Quantity, 315, 3],
            // ["Total sales:  " + rpt.totals.TotalRetail, 155, 3],
            {data: "Total Agreements:  " + rpt.totals.Discounted, width: 100, align: 1},
        ], {x: 30});

    }

}

class ByCategoryReport{
    constructor(){
                // We need a stream for the report to be generated to...
                const pipeStream = new fluentReports.BlobStream();

                // Tell the engine we are saving rendering it to a stream...
                const rpt = new fluentReports.Report(pipeStream,({fontSize: 9}))
                    .margins(40)
                        .autoPrint(false) // Optional
                        // .titleheader(this.titleheader)
                        // .pageFooter(this.footer) // Optional
                        .pageHeader(this.header)

                        .data( reportData )	// REQUIRED
                        .totalFormatter( this.totalFormatter ) // Optional
                        .sum('Quantity')
                        .sum('TotalRetail')
                        .finalSummary(this.finalSummary)// Optional
        
                        rpt.groupBy( "Month" )
                        .header(this.MonthHeader)
                        .footer(this.MonthFooter)
                        .sum('Quantity')
                        .sum('TotalRetail')
        
                        rpt.groupBy( "Category" )
                        .footer(this.CategoryFooter)
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
    header = function(rpt, d){
        rpt.pageNumber({text: "Page {0} of {1}",  align: "right"});
        rpt.printedAt({text: "Printed {3} At: {0}:{1}{2} ",  align: "left"});
        rpt.newLine(3)
        rpt.print("USFT Web Sales by Category", {align: "center", fontSize: 13, fontBold: true})
        // rpt.print(`${d.StartDate} to ${d.EndDate}`, {align: "center", fontSize: 13, fontBold: true})

    }
    MonthHeader = function(x, r){
        x.newLine(2)
        x.fontBold();
        x.band([
            {data: r.Month + ", " + r.Year, width: x.maxX()-68,fontBold: true }
        ], {x: 30});
        x.fontNormal();
        x.band([
            {data: 'Category', width: 270},
            {data: 'Items sold', width: 45, align: 3},
            {data: 'Net sales', width: 155, align: 3}
        ], {x: 30});  // , font: "AldotheApache"});
        x.bandLine(1);
    };
    MonthFooter = function (r,d) {
        r.bandLine(1);

        r.band([
            // [d.Category, 270],
            // ["Total items:  " + r.totals.Quantity, 315, 3],
            // ["Total sales:  " + r.totals.TotalRetail, 155, 3],
            {data: "Total items:  " + r.totals.Quantity, width: 315, align: 3},
            {data: "Total sales:  " + r.totals.TotalRetail, width: 155, align: 3},
        ], {x: 30});
        r.newLine()
    };
    CategoryFooter = function (r,d) {
        r.band([
            // [d.Category, 270],
            // [r.totals.Quantity, 45, 3],
            // [r.totals.TotalRetail, 155, 3],
            {data: d.Category, width: 270},
            {data: r.totals.Quantity, width: 45, align: 3},
            {data: r.totals.TotalRetail, width: 155, align: 3}
        ], {x: 30});
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
                let money = data[key].toFixed(2);
                money = money.toString();
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

    finalSummary = (rpt) => {
        rpt.newLine(3)
        rpt.bandLine(1);
        // rpt.newLine()
        rpt.bandLine(1,3);

        rpt.band([
            // ["Total items:  " + rpt.totals.Quantity, 315, 3],
            // ["Total sales:  " + rpt.totals.TotalRetail, 155, 3],
            {data: "Total items:  " + rpt.totals.Quantity, width: 315, align: 3},
            {data: "Total sales:  " + rpt.totals.TotalRetail, width: 155, align: 3},
        ], {x: 30});
    }

}
class ByProductReport{
    constructor(){
                // We need a stream for the report to be generated to...
                const pipeStream = new fluentReports.BlobStream();

                // Tell the engine we are saving rendering it to a stream...
                const rpt = new fluentReports.Report(pipeStream,({fontSize: 9}))
                    .margins(40)
                        .autoPrint(false) // Optional
                        // .titleheader(this.titleheader)
                        .pageHeader(this.header)
                        // .pageFooter(this.footer) // Optional
                        .data( reportData )	// REQUIRED
                        .totalFormatter( this.totalFormatter ) // Optional
                        .sum('Quantity')
                        .sum('TotalRetail')
                        .finalSummary(this.finalSummary)// Optional

                        rpt.groupBy( "Month" )
                        .header(this.MonthHeader)
                        .footer(this.MonthFooter)
                        .sum('Quantity')
                        .sum('TotalRetail')
        
                        rpt.groupBy( "ProductName" )
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
    header = function(rpt, d){
        rpt.pageNumber({text: "Page {0} of {1}",  align: "right"});
        rpt.printedAt({text: "Printed {3} At: {0}:{1}{2} ",  align: "left"});
        rpt.newLine(3)
        rpt.print("USFT Web Sales by Product", {align: "center", fontSize: 13, fontBold: true})
        // rpt.print(`${d.StartDate} to ${d.EndDate}`, {align: "center", fontSize: 13, fontBold: true})
        
    }
    MonthHeader = function(x, r){
        x.newLine(2)
        x.fontBold();
        x.band([
            {data: r.Month + ", " + r.Year, width: x.maxX()-68,fontBold: true }
        ], {x: 30});
        x.fontNormal();
        x.band([
            {data: 'Product', width: 270},
            {data: 'Items sold', width: 45, align: 3},
            {data: 'Net sales', width: 155, align: 3}
        ], {x: 30});  // , font: "AldotheApache"});
        x.bandLine(1);
    };
    MonthFooter = function (r,d) {
        r.bandLine(1);

        r.band([
            // [d.Category, 270],
            // ["Total items:  " + r.totals.Quantity, 315, 3],
            // ["Total sales:  " + r.totals.TotalRetail, 155, 3],
            {data: "Total items:  " + r.totals.Quantity, width: 315, align: 3},
            {data: "Total sales:  " + r.totals.TotalRetail, width: 155, align: 3},
        ], {x: 30});
        r.newLine()
    };

    CategoryFooter = function (r,d) {
        r.band([
            [d.ProductName, 270],
            [r.totals.Quantity, 45, 3],
            [r.totals.TotalRetail, 155, 3],
        ], {x: 30});
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
                let money = data[key].toFixed(2);
                money = money.toString();
                const idx = money.indexOf('.');
                if (idx === -1) {
                    money += ".00";
                } else if (idx === money.length - 2) {
                    money += "0";
                }
                for (let i = 6; i < money.length; i += 4) {
                    money = money.substring(0, money.length - i) + "," + money.substring(money.length - i);
                }

                data[key] = '$ ' + money

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
    finalSummary = (rpt) => {
        rpt.newLine(3)
        rpt.bandLine(1);
        // rpt.newLine()
        rpt.bandLine(1,3);

        rpt.band([
            // ["Total items:  " + rpt.totals.Quantity, 315, 3],
            // ["Total sales:  " + rpt.totals.TotalRetail, 155, 3],
            {data: "Total items:  " + rpt.totals.Quantity, width: 315, align: 3},
            {data: "Total sales:  " + rpt.totals.TotalRetail, width: 155, align: 3},
        ], {x: 30});
    }

}
class CombinedReport{
    constructor(){
        // We need a stream for the report to be generated to...
        const pipeStream = new fluentReports.BlobStream();

        let prodData = reportData.sort(rankingSorter('MonthNum', 'SKUIndex'));

        // Tell the engine we are saving rendering it to a stream...
        const rpt = new fluentReports.Report(pipeStream,({fontSize: 9}))
            .margins(40)
            .autoPrint(false) // Optional
            .data(reportData)
            .pageHeader(this.header)

        const rpt2 = new fluentReports.Report(rpt, ({isSibling: true}))
            .margins(40)
            .autoPrint(false) // Optional
            // .pageHeader(this.header2)
            .data( reportData )	// REQUIRED
            .totalFormatter( this.totalFormatter ) // Optional

            rpt2.groupBy( "Month" )
            .header(this.MonthHeader2)
            .footer(this.MonthFooter2)
            .sum('Quantity')
            .sum('TotalRetail')


            rpt2.groupBy( "Category" )
            .footer(this.CategoryFooter2)
            // .max("Category")
            .sum('Quantity')
            .sum('TotalRetail')
            
        const rpt3 = new fluentReports.Report(rpt, ({isSibling: true}))
            .margins(40)
            .autoPrint(false) // Optional
            // .data( reportData )	// REQUIRED
            .data( prodData )	// REQUIRED
           .totalFormatter( this.totalFormatter ) // Optional

            rpt3.groupBy( "Month" )
            .header(this.MonthHeader3)
            .footer(this.MonthFooter3)
            .sum('Quantity')
            .sum('TotalRetail')


            rpt3.groupBy( "ProductName" )
            .footer(this.CategoryFooter3)
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
    header = function(rpt, data){
        rpt.pageNumber({text: "Page {0} of {1}",  align: "right"});
        rpt.printedAt({text: "Printed {3} At: {0}:{1}{2} ",  align: "left"});
        rpt.newLine(2)
        rpt.print(`USFT Web Sales for ${data.Month}, ${data.Year}`, {align: "center", fontSize: 13, fontBold: true})
        rpt.newLine(2)
        
    }

    //FOR SECOND REPORT
    header2 = function(rpt){
        rpt.print("By Category", {align: "center", fontSize: 13, fontBold: true})
        rpt.newLine()
    }
    MonthHeader2 = function(x, r){
        // x.newLine()
        x.print("By Category", {align: "center", fontSize: 13, fontBold: true})
        x.newLine(2)
        x.fontNormal();
        x.band([
            {data: 'Category', width: 270},
            {data: 'Items soldggg', width: 45, align: 3},
            {data: 'Net sales', width: 155, align: 3}
        ], {x: 30});  // , font: "AldotheApache"});
        x.bandLine(1);
    };
    MonthFooter2 = function (r,d) {
        r.bandLine(1);
        r.band([
            {data: "Total items:  " + r.totals.Quantity, width: 315, align: 3},
            {data: "Total sales:  " + r.totals.TotalRetail, width: 155, align: 3},
        ], {x: 30});
        r.newLine()
    };
    CategoryFooter2 = function (r,d) {
        r.band([
            [d.Category, 270],
            [r.totals.Quantity, 45, 3],
            [r.totals.TotalRetail, 155, 3],
        ], {x: 30});
        r.newLine()
    };
    //For Third Report
    MonthHeader3 = function(x, r){
        x.newLine()
        x.print("By Product", {align: "center", fontSize: 13, fontBold: true})
        x.newLine(2)
        x.fontNormal();
        x.band([
            {data: 'Product', width: 270},
            {data: 'Items sold', width: 45, align: 3},
            {data: 'Net sales', width: 155, align: 3}
        ], {x: 30});  // , font: "AldotheApache"});
        x.bandLine(1);
    };
    MonthFooter3 = function (r,d) {
        r.bandLine(1);
        r.band([
            {data: "Total items:  " + r.totals.Quantity, width: 315, align: 3},
            {data: "Total sales:  " + r.totals.TotalRetail, width: 155, align: 3},
        ], {x: 30});
        r.newLine()
    };
    CategoryFooter3 = function (r,d) {
        r.band([
            [d.ProductName, 270],
            [r.totals.Quantity, 45, 3],
            [r.totals.TotalRetail, 155, 3],
        ], {x: 30});
        r.newLine()
    };
    totalFormatter = function(data, callback) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === 'Quantity') {
                    continue;
                }
                // Simple Stupid Money formatter.  It is fairly dumb.  ;-)
                let money = data[key].toFixed(2);
                money = money.toString();
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
}