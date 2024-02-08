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
            let requestBody = {
                    startDate: document.getElementById('startDate').value + ' 00:00:00:000',
                    endDate : document.getElementById('endDate').value + ' 23:59:59:999'
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
                default:
                    console.log(reportName + ' not Defined')
                    break;
            }
        } else {
            console.error("Fluent Reports Browser javascript wasn't loaded")
        }
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



