export class DentalModel {
    constructor() {
        this.servicesData = [
            { id: 1, name: 'Implante', price: 'R$ 2.500,00', isNegotiable: false, rawPrice: 2500, icon: 'fa-tooth' },
            { id: 2, name: 'Siso (extração)', price: 'R$ 800,00 a R$ 1.000,00', isNegotiable: true, note: 'Negociação presencial', rawPrice: 800, icon: 'fa-tooth' },
            { id: 3, name: 'Restauração', price: 'R$ 180,00', isNegotiable: false, rawPrice: 180, icon: 'fa-wrench' },
            { id: 4, name: 'Extração geral', price: 'R$ 200,00', isNegotiable: false, rawPrice: 200, icon: 'fa-teeth-open' },
            { id: 5, name: 'Limpeza', price: 'R$ 200,00', isNegotiable: false, rawPrice: 200, icon: 'fa-sparkles' },
            { id: 6, name: 'Profilaxia', price: 'R$ 250,00', isNegotiable: false, rawPrice: 250, icon: 'fa-shield-halved' },
            { id: 7, name: 'Canal', price: 'R$ 800,00', isNegotiable: true, note: 'Negociação presencial', rawPrice: 800, icon: 'fa-vial-virus' },
            { id: 8, name: 'Placas (bruxismo, Clareamento, etc.)', price: 'R$ 800,00', isNegotiable: false, rawPrice: 800, icon: 'fa-mask-face' },
            { id: 9, name: 'Prótese dentária (PPR, total, parcial, FLEX, etc.)', price: 'R$ 1.500,00', isNegotiable: false, rawPrice: 1500, icon: 'fa-teeth' },
            { id: 10, name: 'Coroa de porcelana, IMEX, zirconia e cerômero', price: 'Negociação presencial', isNegotiable: true, note: 'Negociação presencial', rawPrice: 0, icon: 'fa-gem' },
            { id: 11, name: 'Consulta geral', price: 'Negociação presencial', isNegotiable: true, note: 'Negociação presencial', rawPrice: 0, icon: 'fa-stethoscope' }
        ];

        this.DENTIST_CREDENTIALS = {
            cro: '01341',
            password: 'Wilson123@',
            name: 'Dr. Wilson de Jesus Guedes Matos'
        };

        this.currentUser = JSON.parse(localStorage.getItem('dental_user')) || null;
        this.appointments = JSON.parse(localStorage.getItem('dental_appointments')) || [];
        this.registeredPatients = JSON.parse(localStorage.getItem('registered_patients')) || [];
    }

    getServices() {
        return this.servicesData;
    }

    getServiceById(id) {
        return this.servicesData.find(s => s.id === parseInt(id));
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getAppointments() {
        return this.appointments;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem('dental_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('dental_user');
        }
    }

    registerPatient(name, email, password) {
        const existing = this.registeredPatients.find(p => p.email === email);
        if (existing) return { success: false, message: 'E-mail já cadastrado! Faça login.' };

        const newPatient = { name, email, password };
        this.registeredPatients.push(newPatient);
        localStorage.setItem('registered_patients', JSON.stringify(this.registeredPatients));

        const user = { type: 'patient', name, email };
        this.setCurrentUser(user);
        return { success: true, user };
    }

    loginPatient(email, password) {
        const userFound = this.registeredPatients.find(p => p.email === email && p.password === password);
        let user;
        if (userFound) {
            user = { type: 'patient', name: userFound.name, email: userFound.email };
        } else {
            user = { type: 'patient', name: email.split('@')[0], email };
        }
        this.setCurrentUser(user);
        return { success: true, user };
    }

    loginDentist(cro, password) {
        if (cro === this.DENTIST_CREDENTIALS.cro && password === this.DENTIST_CREDENTIALS.password) {
            const user = { type: 'dentist', name: this.DENTIST_CREDENTIALS.name, cro: this.DENTIST_CREDENTIALS.cro };
            this.setCurrentUser(user);
            return { success: true, user };
        }
        return { success: false, message: 'CRO ou Senha incorretos.' };
    }

    addAppointment(serviceId, date, time) {
        const service = this.getServiceById(serviceId);
        if (!service || !this.currentUser) return false;

        const newAppointment = {
            id: Date.now(),
            patientName: this.currentUser.name || this.currentUser.email,
            patientEmail: this.currentUser.email || 'Presencial/Dentista',
            serviceName: service.name,
            price: service.price,
            isNegotiable: service.isNegotiable,
            date,
            time,
            createdAt: new Date().toLocaleDateString('pt-BR')
        };

        this.appointments.push(newAppointment);
        localStorage.setItem('dental_appointments', JSON.stringify(this.appointments));
        return newAppointment;
    }

    cancelAppointment(id) {
        this.appointments = this.appointments.filter(a => a.id !== id);
        localStorage.setItem('dental_appointments', JSON.stringify(this.appointments));
    }

    clearAllAppointments() {
        this.appointments = [];
        localStorage.setItem('dental_appointments', JSON.stringify([]));
    }
}