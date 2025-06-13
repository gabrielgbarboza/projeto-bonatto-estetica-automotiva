// Variáveis globais para Veículos
let vehicles = [
    { placa: 'ABC1D23', modelo: 'HB20', cor: 'Prata', services: [1, 3] }, // Example with pre-selected services
    { placa: 'XYZ9A87', modelo: 'Honda Civic', cor: 'Branco', services: [] },
    { placa: 'DEF5G65', modelo: 'Toyota Corolla', cor: 'Preto', services: [2] },
    { placa: 'GHI3J21', modelo: 'Ford Ka', cor: 'Azul', services: [] }
];
let editingVehicle = null;

// Variáveis globais para Serviços
const availableServices = [
    { id: 1, name: "Lavagem Simples", description: "Lavagem externa básica do veículo", price: 35.00 },
    { id: 2, name: "Lavagem Completa", description: "Lavagem externa e interna completa", price: 65.00 },
    { id: 3, name: "Enceramento", description: "Aplicação de cera protetora na pintura", price: 80.00 },
    { id: 4, name: "Limpeza de Estofados", description: "Lavagem profunda dos bancos e estofados", price: 120.00 },
    { id: 5, name: "Polimento dos Faróis", description: "Recuperação e polimento dos faróis opacos", price: 90.00 },
    { id: 6, name: "Vitrificação da Pintura", description: "Proteção cerâmica de longa duração", price: 450.00 },
    { id: 7, name: "Detalhamento", description: "Serviço completo de detalhamento automotivo", price: 200.00 },
    { id: 8, name: "Pneus e Rodas", description: "Limpeza e brilho em pneus e rodas", price: 45.00 },
    { id: 9, name: "Aspiração", description: "Limpeza interna com aspirador profissional", price: 25.00 },
    { id: 10, name: "Lavagem do Motor", description: "Limpeza e desengraxamento do motor", price: 85.00 }
];
let selectedServices = []; // Stores IDs of selected services for the current vehicle being edited/added.

// Variables for service viewing functionality
let vehicleServicesData = {}; // Stores scheduled services per vehicle
let selectedServiceForSchedule = null;

// Function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        z-index: 3000;
        padding: 20px 25px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        max-width: 350px;
        animation: slideInRight 0.4s ease;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        font-family: 'Poppins', sans-serif;
    `;

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
    } else if (type === 'info') {
        notification.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
    }

    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Add styles for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Function to load services into the modal's service container
function loadServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return; // Exit if element not found

    container.innerHTML = ''; // Clear previous services
    
    availableServices.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        
        const isSelected = selectedServices.includes(service.id);
        serviceItem.innerHTML = `
            <input type="checkbox"
                   class="service-checkbox"
                   id="service-${service.id}"
                   onchange="toggleService(${service.id})"
                   ${isSelected ? 'checked' : ''}>
            <div class="service-info">
                <div class="service-name">${service.name}</div>
                <div class="service-description">${service.description}</div>
            </div>
            <div class="service-price">R$ ${service.price.toFixed(2).replace('.', ',')}</div>
        `;
        
        if (isSelected) {
            serviceItem.classList.add('selected');
        }
        
        // SINGLE click handler for the entire serviceItem
        // This will handle clicks anywhere except on the checkbox itself
        serviceItem.addEventListener('click', function(e) {
            // Don't trigger if the click was directly on the checkbox
            if (e.target.type !== 'checkbox') {
                const checkbox = document.getElementById(`service-${service.id}`);
                checkbox.checked = !checkbox.checked;
                toggleService(service.id);
            }
        });
        
        container.appendChild(serviceItem);
    });
    
    updateSelectedCount();
}
// New function to handle clicks on service info and price areas
function toggleServiceByClick(serviceId) {
    const checkbox = document.getElementById(`service-${serviceId}`);
    checkbox.checked = !checkbox.checked;
    
    // Trigger the change event manually
    const event = new Event('change');
    checkbox.dispatchEvent(event);
}

// Function to toggle service selection
function toggleService(serviceId) {
    const checkbox = document.getElementById(`service-${serviceId}`);
    const serviceItem = checkbox.closest('.service-item');
    
    if (checkbox.checked) {
        if (!selectedServices.includes(serviceId)) {
            selectedServices.push(serviceId);
        }
        serviceItem.classList.add('selected');
    } else {
        selectedServices = selectedServices.filter(id => id !== serviceId);
        serviceItem.classList.remove('selected');
    }
    
    updateSelectedCount();
}

// Function to update the count of selected services
function updateSelectedCount() {
    const countElement = document.getElementById('selectedCount');
    if (!countElement) return; // Exit if element not found

    const count = selectedServices.length;
    countElement.textContent = `${count} serviç${count !== 1 ? 'os' : 'o'} selecionado${count !== 1 ? 's' : ''}`;
    
    if (count > 0) {
        countElement.classList.add('show');
    } else {
        countElement.classList.remove('show');
    }
}

// Função para abrir o modal (Updated to handle services)
function openModal(vehicleData = null) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.querySelector('.modal-header h2');
    const form = document.getElementById('vehicleForm');

    // Reset selected services when opening modal
    selectedServices = [];
    
    if (vehicleData) {
        // Modo edição
        editingVehicle = vehicleData.placa;
        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Veículo';
        document.getElementById('placa').value = vehicleData.placa;
        document.getElementById('modelo').value = vehicleData.modelo;
        document.getElementById('cor').value = vehicleData.cor;
        document.getElementById('placa').disabled = true;

        // Load services already selected for this vehicle
        if (vehicleData.services) {
            selectedServices = [...vehicleData.services]; // Copy array
        }
    } else {
        // Modo cadastro
        editingVehicle = null;
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Cadastro de Veículo';
        form.reset();
        document.getElementById('placa').disabled = false;
    }
    
    loadServices(); // Load/re-render services in the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal (Updated to clear services)
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    const successMessage = document.getElementById('successMessage');
    
    modal.classList.remove('active');
    successMessage.style.display = 'none';
    document.body.style.overflow = 'auto';
    editingVehicle = null;
    selectedServices = []; // Clear selected services when modal closes
    updateSelectedCount(); // Reset count display
}

// Função para formatar placa
function formatPlaca(input) {
    let value = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (value.length > 7) value = value.slice(0, 7); // Max length 7
    
    if (value.length <= 3) {
        input.value = value;
    } else if (value.length === 4 && !isNaN(value.slice(3,4))) { // Mercosul format (letter, number, letter, number...)
        input.value = value.slice(0, 3) + value.slice(3,4); // For a4c3 type
    } else if (value.length > 4 && !isNaN(value.slice(4,5))) {
        // For old type AAA1234 or Mercosul AAA1A23
        input.value = value.slice(0, 3) + value.slice(3,4) + value.slice(4,7);
    } else if (value.length > 3 && isNaN(value.slice(3,4)) && value.length <= 4) { // Mercosul type AAA-B
        input.value = value.slice(0,3) + value.slice(3,4); // Just up to the letter
    } else {
        input.value = value.slice(0,3) + value.slice(3,4) + value.slice(4,7); // Default
    }
}

// Função para renderizar a tabela
function renderTable() {
    const tableBody = document.getElementById('vehicleTableBody');
    const vehicleCount = document.getElementById('vehicleCount');

    vehicleCount.textContent = vehicles.length;

    if (vehicles.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <i class="fas fa-car"></i>
                        <h3>Nenhum veículo cadastrado</h3>
                        <p>Clique em "Adicionar Veículo" para começar</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = vehicles.map(vehicle => `
        <tr>
            <td>
                <div class="vehicle-info">
                    <i class="fas fa-id-card"></i>
                    <strong>${vehicle.placa}</strong>
                </div>
            </td>
            <td>
                <div class="vehicle-info">
                    <i class="fas fa-car"></i>
                    ${vehicle.modelo}
                </div>
            </td>
            <td>
                <div class="vehicle-info">
                    <i class="fas fa-palette"></i>
                    ${vehicle.cor}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewServices('${vehicle.placa}')">
                        <i class="fas fa-eye"></i>Ver Serviços
                    </button>
                    <button class="action-btn edit" onclick="editVehicle('${vehicle.placa}')">
                        <i class="fas fa-edit"></i>Editar
                    </button>
                    <button class="action-btn delete" onclick="deleteVehicle('${vehicle.placa}')">
                        <i class="fas fa-trash"></i>Excluir
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Função para editar veículo
function editVehicle(placa) {
    const vehicle = vehicles.find(v => v.placa === placa);
    if (vehicle) {
        openModal(vehicle);
    }
}

// Função para excluir veículo
function deleteVehicle(placa) {
    if (confirm(`Tem certeza que deseja excluir o veículo de placa ${placa}?`)) {
        vehicles = vehicles.filter(v => v.placa !== placa);
        renderTable();
        showNotification(`Veículo ${placa} excluído com sucesso!`, 'success');
    }
}

// Enhanced function to view services with modal popup
function viewServices(placa) {
    const vehicle = vehicles.find(v => v.placa === placa);
    if (!vehicle) {
        showNotification('Veículo não encontrado.', 'error');
        return;
    }

    // Open services viewing modal
    openServicesModal(vehicle);
}

// Function to open services viewing modal
function openServicesModal(vehicle) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('servicesViewModal');
    if (!modal) {
        modal = createServicesModal();
    }

    // Update modal content
    const modalTitle = modal.querySelector('.popup-title');
    const servicesContent = modal.querySelector('#servicesViewContent');
    
    modalTitle.textContent = `Serviços do Veículo ${vehicle.placa}`;
    
    // Render services for this vehicle
    renderVehicleServices(vehicle, servicesContent);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Function to create services viewing modal
function createServicesModal() {
    const modal = document.createElement('div');
    modal.id = 'servicesViewModal';
    modal.className = 'services-view-modal';
    modal.innerHTML = `
        <div class="services-popup" onclick="event.stopPropagation()">
            <div class="popup-header">
                <h2 class="popup-title">Serviços do Veículo</h2>
                <button class="close-btn" onclick="closeServicesModal()">×</button>
            </div>
            
            <div class="popup-content" id="servicesViewContent">
                <!-- Services will be rendered here -->
            </div>
            
            <div class="popup-footer">
                <button class="add-service-btn" onclick="addServiceToVehicle()" title="Adicionar Serviço">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;

    // Add styles for the services modal
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .services-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .services-view-modal.active {
            display: flex;
        }

        .services-popup {
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .services-popup .popup-header {
            background: #007bff;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .services-popup .popup-title {
            font-size: 20px;
            font-weight: bold;
        }

        .services-popup .close-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 20px;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .services-popup .close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .services-popup .popup-content {
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
        }

        .vehicle-service-item {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            transition: all 0.3s ease;
        }

        .vehicle-service-item:hover {
            transform: translateX(5px);
            border-color: #007bff;
            box-shadow: 0 3px 10px rgba(0,123,255,0.1);
        }

        .vehicle-service-name {
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .vehicle-service-price {
            font-size: 18px;
            color: #333;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .vehicle-service-description {
            color: #666;
            font-size: 14px;
        }

        .no-services-message {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }

        .no-services-icon {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.6;
        }

        .services-popup .popup-footer {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
        }

        .add-service-btn {
            background: #28a745;
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(40,167,69,0.3);
        }

        .add-service-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(40,167,69,0.4);
        }
    `;
    document.head.appendChild(modalStyles);

    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeServicesModal();
        }
    });

    document.body.appendChild(modal);
    return modal;
}

// Function to render services for a specific vehicle
function renderVehicleServices(vehicle, container) {
    if (!vehicle.services || vehicle.services.length === 0) {
        container.innerHTML = `
            <div class="no-services-message">
                <div class="no-services-icon">🚗</div>
                <h3>Nenhum serviço selecionado</h3>
                <p>Este veículo ainda não possui serviços selecionados.<br>Clique no botão "+" para adicionar serviços.</p>
            </div>
        `;
        return;
    }

    const serviceItems = vehicle.services.map(serviceId => {
        const service = availableServices.find(s => s.id === serviceId);
        if (!service) return '';
        
        return `
            <div class="vehicle-service-item">
                <div class="vehicle-service-name">
                    <i class="fas fa-car"></i>${service.name}
                </div>
                <div class="vehicle-service-price">R$ ${service.price.toFixed(2).replace('.', ',')}</div>
                <div class="vehicle-service-description">${service.description}</div>
            </div>
        `;
    }).filter(item => item !== '').join('');

    container.innerHTML = serviceItems;
}

// Function to close services modal
function closeServicesModal() {
    const modal = document.getElementById('servicesViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Placeholder function for adding services to vehicle (can be enhanced later)
function addServiceToVehicle() {
    showNotification('Funcionalidade de adicionar serviços em desenvolvimento!', 'info');
    // This could open another modal to select and add services to the current vehicle
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Formatação automática da placa
    const placaInput = document.getElementById('placa');
    if (placaInput) {
        placaInput.addEventListener('input', function() {
            formatPlaca(this);
        });
    }

    // Submit do formulário
    const form = document.getElementById('vehicleForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const placa = document.getElementById('placa').value.trim();
            const modelo = document.getElementById('modelo').value.trim();
            const cor = document.getElementById('cor').value.trim();

            // Validações
            if (!placa || !modelo || !cor) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            if (placa.length < 7) {
                showNotification('Por favor, insira uma placa válida.', 'error');
                return;
            }

            // Check if already exists (only in add mode)
            if (!editingVehicle && vehicles.some(v => v.placa === placa)) {
                showNotification('Já existe um veículo cadastrado com esta placa.', 'error');
                return;
            }

            const newVehicleData = {
                placa: placa,
                modelo: modelo,
                cor: cor,
                services: [...selectedServices] // Include selected services (copy array)
            };

            if (editingVehicle) {
                // Update existing vehicle
                const index = vehicles.findIndex(v => v.placa === editingVehicle);
                if (index !== -1) {
                    vehicles[index] = newVehicleData; // Update all data
                }
            } else {
                // Add new vehicle
                vehicles.push(newVehicleData);
            }

            // Show success message
            const successMessage = document.getElementById('successMessage');
            const serviceCount = selectedServices.length;
            successMessage.textContent = editingVehicle ?
                `Veículo atualizado com sucesso! ${serviceCount} serviços selecionados.` :
                `Veículo cadastrado com sucesso! ${serviceCount} serviços selecionados.`;
            successMessage.style.display = 'block';

            // Clear form and update table
            form.reset();
            renderTable();
            selectedServices = []; // Clear for next add/edit
            updateSelectedCount(); // Update count display

            // Close modal after 2 seconds
            setTimeout(() => {
                closeModal();
            }, 2000);
        });
    }

    // Fechar modal ao clicar fora dele
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const servicesModal = document.getElementById('servicesViewModal');
            const mainModal = document.getElementById('modalOverlay');
            
            if (servicesModal && servicesModal.classList.contains('active')) {
                closeServicesModal();
            } else if (mainModal && mainModal.classList.contains('active')) {
                closeModal();
            }
        }
    });

    // Renderizar tabela inicial
    renderTable();

    // Make functions globally available for inline onclick attributes
    window.openModal = openModal;
    window.editVehicle = editVehicle;
    window.deleteVehicle = deleteVehicle;
    window.viewServices = viewServices;
    window.closeModal = closeModal;
    window.closeServicesModal = closeServicesModal;
    window.toggleService = toggleService;
    window.addServiceToVehicle = addServiceToVehicle;
});