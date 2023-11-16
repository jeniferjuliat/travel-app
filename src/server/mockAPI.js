function mockApiCall(requestData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                geo: {
                    name: requestData.destination,
                    countryName: "Sample Country",
                },
                weather: {
                    temperature: "25",
                    weatherDescription: "Sunny"
                },
                images: [
                    { thumbnail: "path/to/sample/image.jpg", large: "path/to/sample/large/image.jpg" }
                ]
            });
        }, 2000); 
    });
}


module.exports = mockApiCall;
