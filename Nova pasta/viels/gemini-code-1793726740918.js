export class AppView {
    constructor() {
        this.authArea = document.getElementById('authArea');
        this.servicesGrid = document.getElementById('servicesGrid');
        this.bookingServiceSelect = document.getElementById('bookingService');
        this.servicePriceBadge = document.getElementById('servicePriceBadge');
        this.bookingDateInput = document.getElementById('bookingDate');
        this.bookingPatientNameInput = document.getElementById('bookingPatientName');
        this.weekendAlert = document.getElementById('weekendAlert');
        this.btnSubmitBooking = document.getElementById('btnSubmitBooking');
        this.dentistDashboard = document.getElementById('dentistDashboard');
        this.dentistAppointmentsList = document.getElementById('dentistAppointmentsList');
        this.noAppointmentsMsg = document.getElementById('noAppointmentsMsg');
        
        // Modal elementos
        this.authModal = document.getElementById('authModal');
        this.patientForms = document.getElementById('patientForms');
        this.dentistForm = document.getElementById('dentistForm');
        this.tabPatient = document.getElementById('tabPatient');
        this.tabDentist = document.getElementById('tabDentist');
        this.patientModalTitle = document.getElementById('patientModalTitle');
        this.togglePatientModeBtn = document.getElementById('togglePatientModeBtn');
        this.patientNameField = document.getElementById('patientNameField');
        this.patientSubmitBtn = document.getElementById('patientSubmitBtn');
    }

    setMinBookingDate() {
        const today = new Date().toISOString().split('T')[0];
        this.bookingDateInput.setAttribute('min', today);
    }

    renderServices(services) {
        this.servicesGrid.innerHTML = services.map(service => `
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                    <div class="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-dental-600 mb-4 group-hover:bg-dental-600 group-hover:text-white transition-colors">
                        <i class="fa-solid ${service.icon} text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 leading-snug">${service.name}</h3>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                        <span class="text-xs text-slate-400 block font-medium">Valor do Procedimento</span>
                        <span class="text-base font-extrabold ${service.isNegotiable ? 'text-amber-600' : 'text-dental-700'}">
                            ${service.price}
                        </span>
                    </div>
                    ${service.isNegotiable ? `
                        <span class="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200">
                            Negociação presencial
                        </span>
                    ` : ''}
                </div>
            </div>
        `).join('');

        this.bookingServiceSelect.innerHTML = '<option value="" disabled selected>Selecione um procedimento</option>' + 
            services.map(s => `<option value="${s.id}">${s.name} - ${s.price}</option>`).join('');
    }

    updateServiceBadge(service) {
        if (!service) {
            this.servicePriceBadge.innerHTML = '';
            return;
        }
        if (service.isNegotiable) {
            this.servicePriceBadge.innerHTML = `<span class="text-amber-600 font-bold"><i class="fa-solid fa-circle-info mr-1"></i>Este procedimento exige negociação presencial ou avaliação.</span>`;
        } else {
            this.servicePriceBadge.innerHTML = `<span class="text-emerald-600 font-bold"><i class="fa-solid fa-circle-check mr-1"></i>Valor fixado em ${service.price}</span>`;
        }
    }

    toggleWeekendAlert(isWeekend) {
        if (isWeekend) {
            this.weekendAlert.classList.remove('hidden');
            this.btnSubmitBooking.disabled = true;
            this.btnSubmitBooking.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.weekendAlert.classList.add('hidden');
            this.btnSubmitBooking.disabled = false;
            this.btnSubmitBooking.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    updateAuthArea(currentUser) {
        if (currentUser) {
            if (currentUser.type === 'dentist') {
                this.authArea.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-slate-700">
                            <i class="fa-solid fa-user-doctor text-dental-400 mr-1.5"></i>Dr. Wilson (CRO: ${currentUser.cro})
                        </span>
                        <button id="btnLogout" class="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                            Sair
                        </button>
                    </div>
                `;
                this.bookingPatientNameInput.value = `Dr. Wilson (Dentista)`;
                this.dentistDashboard.classList.remove('hidden');
            } else {
                this.authArea.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-bold bg-dental-50 text-dental-800 px-3 py-1.5 rounded-xl border border-dental-200">
                            <i class="fa-regular fa-user text-dental-600 mr-1.5"></i>${currentUser.name}
                        </span>
                        <button id="btnLogout" class="text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                            Sair
                        </button>
                    </div>
                `;
                this.bookingPatientNameInput.value = `${currentUser.name} (${currentUser.email})`;
                this.dentistDashboard.classList.add('hidden');
            }
        } else {
            this.authArea.innerHTML = `
                <button id="btnOpenLogin" class="px-5 py-2.5 text-sm font-semibold text-dental-700 bg-dental-50 hover:bg-dental-100 rounded-xl transition-all border border-dental-200">
                    <i class="fa-solid fa-right-to-bracket mr-2"></i>Entrar
                </button>
                <button id="btnOpenRegister" class="px-5 py-2.5 text-sm font-semibold text-white bg-dental-600 hover:bg-dental-700 rounded-xl shadow-lg shadow-dental-600/30 hover:shadow-none transition-all">
                    Criar Conta
                </button>
            `;
            this.bookingPatientNameInput.value = '';
            this.bookingPatientNameInput.placeholder = 'Faça login para realizar o agendamento';
            this.dentistDashboard.classList.add('hidden');
        }
    }

    renderAppointments(appointments) {
        if (appointments.length === 0) {
            this.dentistAppointmentsList.innerHTML = '';
            this.noAppointmentsMsg.classList.remove('hidden');
            return;
        }

        this.noAppointmentsMsg.classList.add('hidden');
        this.dentistAppointmentsList.innerHTML = appointments.map(app => `
            <tr class="hover:bg-slate-700/40 transition-colors">
                <td class="px-6 py-4 font-bold text-white">
                    ${app.patientName}
                    <span class="block text-xs font-normal text-slate-400">${app.patientEmail}</span>
                </td>
                <td class="px-6 py-4 font-medium text-dental-300">
                    ${app.serviceName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <i class="fa-regular fa-calendar text-slate-400 mr-1.5"></i>${this.formatDate(app.date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <i class="fa-regular fa-clock text-slate-400 mr-1.5"></i>${app.time}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${app.isNegotiable ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
                        ${app.price}
                    </span>
                </td>
                <td class="px-6 py-4 text-center">
                    <button data-cancel-id="${app.id}" class="btn-cancel-app text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-colors" title="Cancelar Agendamento">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    openAuthModal() {
        this.authModal.classList.remove('hidden');
    }

    closeAuthModal() {
        this.authModal.classList.add('hidden');
    }

    switchAuthTab(type) {
        if (type === 'patient') {
            this.tabPatient.className = 'flex-1 pb-3 text-sm font-bold text-dental-600 border-b-2 border-dental-600';
            this.tabDentist.className = 'flex-1 pb-3 text-sm font-bold text-slate-400 border-b-2 border-transparent hover:text-slate-600';
            this.patientForms.classList.remove('hidden');
            this.dentistForm.classList.add('hidden');
        } else {
            this.tabDentist.className = 'flex-1 pb-3 text-sm font-bold text-slate-900 border-b-2 border-slate-900';
            this.tabPatient.className = 'flex-1 pb-3 text-sm font-bold text-slate-400 border-b-2 border-transparent hover:text-slate-600';
            this.dentistForm.classList.remove('hidden');
            this.patientForms.classList.add('hidden');
        }
    }

    updatePatientAuthMode(isRegister) {
        if (isRegister) {
            this.patientModalTitle.innerText = 'Criar Nova Conta';
            this.togglePatientModeBtn.innerText = 'Já possui conta? Faça Login';
            this.patientNameField.classList.remove('hidden');
            this.patientSubmitBtn.innerText = 'Cadastrar E-mail e Senha';
        } else {
            this.patientModalTitle.innerText = 'Entrar como Paciente';
            this.togglePatientModeBtn.innerText = 'Não tem conta? Cadastre-se';
            this.patientNameField.classList.add('hidden');
            this.patientSubmitBtn.innerText = 'Entrar na Conta';
        }
    }

    showToast(msg, type = 'info') {
        const toast = document.getElementById('toast');
        const message = document.getElementById('toastMessage');
        const icon = document.getElementById('toastIcon');

        message.innerText = msg;
        if (type === 'success') {
            icon.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400 text-lg"></i>';
        } else if (type === 'error') {
            icon.innerHTML = '<i class="fa-solid fa-circle-xmark text-red-400 text-lg"></i>';
        } else {
            icon.innerHTML = '<i class="fa-solid fa-circle-info text-dental-400 text-lg"></i>';
        }

        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 4000);
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
}