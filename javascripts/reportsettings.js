    var reportData
    function updateFormAction() {
        const report = document.getElementById("report").value;
        const form = document.getElementById("reportForm");
        // form.onsubmit = `startReport(${report}); return false`
        form.setAttribute('onsubmit', `startReport(${report}); return false`)
    }
    async function startReport() {
        if (typeof fluentReports !== "undefined") {
            let reportName = document.getElementById('report').value
            let chosen = document.getElementById('report').value;
            let sDate, eDate
            let cDate = document.getElementById('reportMonth').value
            let cYear = cDate.substr(0, 4);
            let cMonth = cDate.substr(5,2);
            if(chosen === 'Combined'){
                sDate = `${cDate}-01 00:00:00:000`
                let eomDay = getLastDayOfMonth(+cYear,+cMonth - 1)
                eDate = `${cDate}-${eomDay} 23:59:59:999`
            }else{
                sDate = document.getElementById('startDate').value + ' 00:00:00:000';
                eDate = document.getElementById('endDate').value + ' 23:59:59:999'
            }

            let requestBody= {
                startDate: sDate,
                endDate : eDate
            };

            switch (reportName) {
                case 'ServiceAgreements':
                    await getDataFromNodeCall('POST', '/commerce/getServiceAgreementsSold', requestBody).then(function(data){
                        reportData = data
                        let SAReport = new ServiceAgreementReport()
                    })
                    
                    break;
            
                case 'ByCategory':
                await getDataFromNodeCall('POST', '/commerce/getTranDetails', requestBody).then(function(data){
                        reportData = data
                        let CatReport = new ByCategoryReport()
                    })
                    
                    break;
                case 'ByProduct':

                    await getDataFromNodeCall('POST', '/commerce/getTranDetails', requestBody).then(function(data){
                        reportData = data
                        let ProdReport = new ByProductReport()
                    })
                    
                    break;
                case 'Combined':
                    await getDataFromNodeCall('POST', '/commerce/getTranDetails', requestBody).then(function(data){
                        reportData = data
                        let CmbReport = new CombinedReport()
                    })
                    
                    break;
                default:
                    console.log(reportName + ' not Defined')
                    break;
            }
        } else {
            console.error("Fluent Reports Browser javascript wasn't loaded")
        }
    }


    function getLastDayOfMonth(year, month) {
        let date = new Date(year, month + 1, 0);
        return date.getDate();
      }
    function displayReport(err, pipeStream) { // jshint ignore:line
        if (err) {
            console.error(err);
            alert(err);
        } else {
            const iFrame = document.getElementById('iframe');
            if (iFrame) {
                iFrame.src = pipeStream.toBlobURL('application/pdf');
            } else {
                console.error("Unable to find iFrame to show report");
                alert("Unable to find iFrame to show report");
            }
        }
    }



