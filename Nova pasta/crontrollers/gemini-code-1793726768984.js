export class AppController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.isPatientRegisterMode = false;
    }

    init() {
        this.view.setMinBookingDate();
        this.view.renderServices(this.model.getServices());
        this.view.updateAuthArea(this.model.getCurrentUser());
        this.view.renderAppointments(this.model.getAppointments());

        this.bindEvents();
    }

    bindEvents() {
        // Eventos Globais de Autenticação na Header
        document.addEventListener('click', (e) => {
            if (e.target.closest('#btnOpenLogin')) {
                this.isPatientRegisterMode = false;
                this.view.updatePatientAuthMode(false);
                this.view.openAuthModal();
            }
            if (e.target.closest('#btnOpenRegister')) {
                this.isPatientRegisterMode = true;
                this.view.updatePatientAuthMode(true);
                this.view.openAuthModal();
            }
            if (e.target.closest('#btnLogout')) {
                this.model.setCurrentUser(null);
                this.view.updateAuthArea(null);
                this.view.showToast('Você saiu da sua conta.', 'info');
            }
            if (e.target.closest('.btn-cancel-app')) {
                const id = parseInt(e.target.closest('.btn-cancel-app').dataset.cancelId);
                this.model.cancelAppointment(id);
                this.view.renderAppointments(this.model.getAppointments());
                this.view.showToast('Agendamento removido.', 'info');
            }
        });

        // Eventos do Modal
        document.getElementById('btnCloseModal').addEventListener('click', () => this.view.closeAuthModal());
        document.getElementById('tabPatient').addEventListener('click', () => this.view.switchAuthTab('patient'));
        document.getElementById('tabDentist').addEventListener('click', () => this.view.switchAuthTab('dentist'));
        
        this.view.togglePatientModeBtn.addEventListener('click', () => {
            this.isPatientRegisterMode = !this.isPatientRegisterMode;
            this.view.updatePatientAuthMode(this.isPatientRegisterMode);
        });

        // Submit Login Paciente
        document.getElementById('patientAuthForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('patientEmailInput').value.trim();
            const password = document.getElementById('patientPasswordInput').value.trim();
            const name = document.getElementById('patientNameInput').value.trim();

            if (!email || !password) {
                this.view.showToast('Preencha os campos obrigatórios.', 'error');
                return;
            }

            if (this.isPatientRegisterMode) {
                if (!name) {
                    this.view.showToast('Por favor, informe seu nome.', 'error');
                    return;
                }
                const res = this.model.registerPatient(name, email, password);
                if (!res.success) {
                    this.view.showToast(res.message, 'error');
                    return;
                }
                this.view.showToast(`Conta criada com sucesso! Bem-vindo, ${name}.`, 'success');
            } else {
                const res = this.model.loginPatient(email, password);
                this.view.showToast('Login realizado com sucesso!', 'success');
            }

            this.view.closeAuthModal();
            this.view.updateAuthArea(this.model.getCurrentUser());
        });

        // Submit Login Dentista
        document.getElementById('dentistAuthForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const cro = document.getElementById('dentistCroInput').value.trim();
            const password = document.getElementById('dentistPasswordInput').value.trim();

            const res = this.model.loginDentist(cro, password);
            if (res.success) {
                this.view.showToast('Acesso concedido ao Dr. Wilson!', 'success');
                this.view.closeAuthModal();
                this.view.updateAuthArea(this.model.getCurrentUser());
                this.view.renderAppointments(this.model.getAppointments());
            } else {
                this.view.showToast(res.message, 'error');
            }
        });

        // Formulário de Agendamento
        document.getElementById('bookingService').addEventListener('change', (e) => {
            const service = this.model.getServiceById(e.target.value);
            this.view.updateServiceBadge(service);
        });

        document.getElementById('bookingDate').addEventListener('change', (e) => {
            if (!e.target.value) return;
            const date = new Date(e.target.value + 'T00:00:00');
            const isWeekend = (date.getDay() === 0 || date.getDay() === 6);
            this.view.toggleWeekendAlert(isWeekend);
        });

        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const user = this.model.getCurrentUser();
            if (!user) {
                this.view.showToast('Por favor, faça login para agendar sua consulta.', 'error');
                this.view.openAuthModal();
                return;
            }

            const serviceId = document.getElementById('bookingService').value;
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;

            const newApp = this.model.addAppointment(serviceId, date, time);
            if (newApp) {
                this.view.showToast('Consulta agendada com sucesso!', 'success');
                document.getElementById('bookingForm').reset();
                this.view.updateServiceBadge(null);
                this.view.toggleWeekendAlert(false);
                this.view.renderAppointments(this.model.getAppointments());
            }
        });

        // Limpar Registros
        document.getElementById('btnClearAllAppointments').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja apagar todos os agendamentos?')) {
                this.model.clearAllAppointments();
                this.view.renderAppointments(this.model.getAppointments());
                this.view.showToast('Todos os registros foram apagados.', 'info');
            }
        });
    }
}