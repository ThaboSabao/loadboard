getJobs = () => {
    db.collection('Advertised').onSnapshot((querySnapshot) => {
            querySnapshot.forEach(job => {
                const jobData = job.data();
                let jobRowDiv = document.createElement('div');
                const vehicleAmount = jobData.vehicles.length;
                const collectionDate = new Date(jobData.collectionDate * 1000);
                const collectionDay = collectionDate.getDate();
                const collectionMonth = collectionDate.getMonth();
                const collectionYear = collectionDate.getFullYear();
                const formatedCollectionDate = `${collectionDay}/${collectionMonth}/${collectionYear}`;
                const deliveryDate = new Date(jobData.deliveryDate * 1000);
                const deliveryDay = deliveryDate.getDate();
                const deliveryMonth = deliveryDate.getMonth();
                const deliveryYear = deliveryDate.getFullYear();
                const formatedDeliveryDate = `${deliveryDay}/${deliveryMonth}/${deliveryYear}`;
                const jobRowHtml = `
                                    <div>${(jobData.service == 0) ? 'Transported' : 'Driven'}</div>
                                    <div>
                                        <div>${jobData.collectionCity}</div>
                                        <div>${formatedCollectionDate}</div>
                                    </div>
                                    <div>
                                        <div>${jobData.deliveryCity}</div>
                                        <div>${formatedDeliveryDate}</div>
                                    </div>
                                    <div>£${jobData.price}</div>
                                    <div>${vehicleAmount} ${(vehicleAmount == 1) ? 'Vehicle' : 'Vehicles'}</div>
                                    <br>
                                    `;
                jobRowDiv.innerHTML = jobRowHtml;
                document.getElementById('loadboard-cont').appendChild(jobRowDiv);
            });
        });
}
getJobs();

vehicles = [];

addVehicle = () => {
    const id = vehicles.length + 1;
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const registration = document.getElementById('registration').value;
    vehicles.push({ id, make, model, registration });
    clearVehicleForm();
    createVehicleRow(id, make, model, registration);
}

createVehicleRow = (id, make, model, registration) => {
    const rowHTML = `
                    <div>${id}</div>
                    <div>${make}</div>
                    <div>${model}</div>
                    <div>${registration}</div> 
                    `;
    let vehicle = document.createElement('div');
    vehicle.innerHTML = rowHTML
    document.getElementById('vehicle-list').appendChild(vehicle);
}

clearVehicleForm = () => {
    document.getElementById('make').value = '';
    document.getElementById('model').value = '';
    document.getElementById('registration').value = '';
}

submitJob = async () => {
    const id = createId();
    const formValues = getFromValues();
    const job = {
        id,
        collectionCity: formValues.collectionCity,
        collectionDate: formValues.collectionDate,
        deliveryCity: formValues.deliveryCity,
        deliveryDate: formValues.deliveryDate,
        service: formValues.service,
        price: formValues.price,
        vehicles,
        expiry: formValues.expiry,
        advertised: true
    }
    try {
        postJob(job);
        clearForm();
        getJobs();
        toggleAdvertiseForm();
    } catch (err) {
        console.error(err);
        alert('An error occurred posting your job. Try again')
    }
}

postJob = async (job) => {
    return db.collection('Advertised').doc(job.id).set(job)
        .then(docRef => {
            return docRef.id;
        })
        .catch(err => {
            return err;
        });
}

getFromValues = () => {
    const collectionCity = document.getElementById('collectionCity').value;
    const collectionDate = new Date(document.getElementById('collectionDate').value).getTime() / 1000;
    const deliveryCity = document.getElementById('deliveryCity').value;
    const deliveryDate = new Date(document.getElementById('deliveryDate').value).getTime() / 1000;
    const service = document.getElementById('service').value;
    const price = document.getElementById('price').value;
    const expiry = new Date(document.getElementById('expiry').value) / 100;

    const formValues = {
        collectionCity,
        collectionDate,
        deliveryCity,
        deliveryDate,
        service,
        price,
        expiry
    }

    return formValues;
}

createId = () => {
    let id = '';
    for (let i = 0; i < 9; i++) {
        id += `${Math.floor(Math.random() * 9)}`
    }
    return id;
}

clearForm = () => {
    clearVehicleForm();
    document.getElementById('vehicle-list').remove();
    document.getElementById('collectionCity').value = '';
    document.getElementById('collectionDate').value = '';
    document.getElementById('deliveryCity').value = '';
    document.getElementById('deliveryDate').value = '';
    document.getElementById('service').value = 0;
    document.getElementById('price').value = '';
    document.getElementById('expiry').value = '';
    vehicles = [];
    let vehicle = document.createElement('div');
    vehicle.setAttribute("id", "vehicle-list");
    document.getElementById('vehicle-list-wrap').appendChild(vehicle);
}

displayForm = false;

toggleAdvertiseForm = () => {
    displayForm = !displayForm;
    document.getElementById('advertiseFormToggle').innerText = (displayForm) ? 'Close' : 'Advertise Job';
    document.getElementById('advertiseForm').style.display = (displayForm) ? 'block' : 'none';
}