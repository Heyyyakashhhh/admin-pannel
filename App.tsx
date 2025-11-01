import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Client, Owner, PlanType } from './types';
import { PLAN_DURATIONS_MONTHS, PLAN_PRICES } from './constants';
import { Dashboard } from './components/Dashboard';
import { RenewalModal } from './components/RenewalModal';
import { AddEditClientView } from './components/AddEditClientView';
import { SettingsView } from './components/SettingsView';
import { DashboardIcon, UsersIcon, SettingsIcon, CodeIcon, BellIcon } from './components/Icons';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { NotificationPopover } from './components/NotificationPopover';
import { PersistenceInfo } from './components/PersistenceInfo';
import { WelcomeModal } from './components/WelcomeModal';

type View = 'DASHBOARD' | 'ADD_CLIENT' | 'EDIT_CLIENT' | 'SETTINGS';

const App: React.FC = () => {
    useEffect(() => {
        // load clients and owner from backend on start
        (async () => {
            try {
                const [cRes, oRes] = await Promise.all([fetch('/api/clients'), fetch('/api/kv/gymOwner')]);
                const clientsData = cRes.ok ? await cRes.json() : [];
                const ownerData = oRes.ok ? await oRes.json() : null;
                if (Array.isArray(clientsData) && clientsData.length) setClients(clientsData);
                if (ownerData) setOwner(ownerData);
            } catch (err) {
                console.error('initial data load failed', err);
            }
        })();
    }, []);

    
    const [clients, setClients] = useState<Client[]>([]);

    const [owner, setOwner] = useState<Owner | null>(null);

    const [showPersistenceInfo, setShowPersistenceInfo] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        // save full clients array to backend
        fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clients) }).catch(err => console.error('save clients failed', err));
    }, [clients]);

    useEffect(() => {
        if (owner !== null) {
            fetch('/api/kv/gymOwner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(owner) }).catch(err => console.error('save owner failed', err));
        }
    }, [owner]);
    
    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
        if (!hasSeenWelcome && clients.length === 0) {
            setShowWelcomeModal(true);
        } else {
            const hasSeenInfo = localStorage.getItem('hasSeenPersistenceInfo');
            if (!hasSeenInfo) {
                setShowPersistenceInfo(true);
            }
        }
    }, []);

    const [activeView, setActiveView] = useState<View>('DASHBOARD');
    
    const [isRenewalModalOpen, setRenewalModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [activeSearchQuery, setActiveSearchQuery] = useState('');
    const [expiredSearchQuery, setExpiredSearchQuery] = useState('');


    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDismissPersistenceInfo = () => {
        localStorage.setItem('hasSeenPersistenceInfo', 'true');
        setShowPersistenceInfo(false);
    };

    const handleContinueWelcome = () => {
        localStorage.setItem('hasSeenWelcomeModal', 'true');
        setShowWelcomeModal(false);
    };

    const handleGoToSettingsFromWelcome = () => {
        localStorage.setItem('hasSeenWelcomeModal', 'true');
        setShowWelcomeModal(false);
        setActiveView('SETTINGS');
        // persist welcome flag
        fetch('/api/kv/hasSeenWelcome', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(true) }).catch(err => console.error('save welcome failed', err));
    };

    const handleOpenRenewalModal = (client: Client) => {
        setSelectedClient(client);
        setRenewalModalOpen(true);
    };

    const handleCloseRenewalModal = () => {
        setSelectedClient(null);
        setRenewalModalOpen(false);
    };

    const handleOpenDeleteModal = (client: Client) => {
        setClientToDelete(client);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setClientToDelete(null);
        setDeleteModalOpen(false);
    };
    
    const handleConfirmDelete = () => {
        if (clientToDelete) {
            setClients(prevClients => prevClients.filter(client => client.id !== clientToDelete.id));
            handleCloseDeleteModal();
        }
    };


    const handleRenewPlan = (clientId: string, newPlanType: PlanType, newStartDateISO: string, newPaymentNotes: string) => {
        setClients(prevClients => prevClients.map(client => {
            if (client.id === clientId) {
                const newStartDate = new Date(newStartDateISO);
                const duration = PLAN_DURATIONS_MONTHS[newPlanType];
                const newEndDate = new Date(newStartDate.getTime());

                const originalUTCDate = newStartDate.getUTCDate();
                newEndDate.setUTCMonth(newEndDate.getUTCMonth() + duration);

                if (newEndDate.getUTCDate() !== originalUTCDate) {
                    newEndDate.setUTCDate(0);
                }
                
                return {
                    ...client,
                    plan_type: newPlanType,
                    plan_price: PLAN_PRICES[newPlanType],
                    start_date: newStartDate.toISOString(),
                    end_date: newEndDate.toISOString(),
                    payment_notes: newPaymentNotes,
                    is_active: true
                };
            }
            return client;
        }));
        handleCloseRenewalModal();
    };

    const handleSaveClient = (clientToSave: Client) => {
        const isEditing = clients.some(c => c.id === clientToSave.id);
        if (isEditing) {
            setClients(clients.map(c => c.id === clientToSave.id ? clientToSave : c));
        } else {
            const newClient = {
                ...clientToSave,
                id: crypto.randomUUID(),
            };
            setClients([newClient, ...clients]);
        }
        setActiveView('DASHBOARD');
        setSelectedClient(null);
    };
    
    const handleEditClient = (client: Client) => {
        setSelectedClient(client);
        setActiveView('EDIT_CLIENT');
    }

    const handleAddNewClient = () => {
        setSelectedClient(null);
        setActiveView('ADD_CLIENT');
    }

    const handleSaveOwner = (newOwner: Owner) => {
        setOwner(newOwner);
    };

    const partitionedClients = useMemo(() => {
        const now = new Date();
        const todayUTCStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        
        const active: Client[] = [];
        const expired: Client[] = [];

        for (const client of clients) {
            if (new Date(client.end_date) < todayUTCStart) {
                expired.push(client);
            } else {
                active.push(client);
            }
        }
        return { active, expired };
    }, [clients]);

     const filteredActiveClients = useMemo(() => {
        return partitionedClients.active
            .filter(client => client.client_name.toLowerCase().includes(activeSearchQuery.toLowerCase()))
            .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
     }, [partitionedClients.active, activeSearchQuery]);

     const filteredExpiredClients = useMemo(() => {
        return partitionedClients.expired
            .filter(client => client.client_name.toLowerCase().includes(expiredSearchQuery.toLowerCase()))
            .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
     }, [partitionedClients.expired, expiredSearchQuery]);

    const { activeClientsCount, totalRevenue, expiredRevenue, grandTotalRevenue } = useMemo(() => {
        const activeClientsList = partitionedClients.active;
        const expiredClientsList = partitionedClients.expired;
        
        const activeRev = activeClientsList.reduce((sum, client) => sum + client.plan_price, 0);
        const expiredRev = expiredClientsList.reduce((sum, client) => sum + client.plan_price, 0);

        return {
            activeClientsCount: activeClientsList.length,
            totalRevenue: activeRev,
            expiredRevenue: expiredRev,
            grandTotalRevenue: activeRev + expiredRev,
        };
    }, [partitionedClients.active, partitionedClients.expired]);

    const expiringSoonClients = useMemo(() => {
        const now = new Date();
        const todayUTCStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        
        const sevenDaysFromTodayUTC = new Date(todayUTCStart.getTime());
        sevenDaysFromTodayUTC.setUTCDate(sevenDaysFromTodayUTC.getUTCDate() + 7);
        
        return partitionedClients.active.filter(c => {
            const endDateObj = new Date(c.end_date);
            return endDateObj.getTime() <= sevenDaysFromTodayUTC.getTime();
        });
    }, [partitionedClients.active]);

    const renderContent = () => {
        const dashboardProps = {
            activeClients: filteredActiveClients,
            expiredClients: filteredExpiredClients,
            onRenewClient: handleOpenRenewalModal,
            onEditClient: handleEditClient,
            onDeleteClient: handleOpenDeleteModal,
            expiringSoonCount: expiringSoonClients.length,
            activeClientsCount: activeClientsCount,
            expiredClientsCount: partitionedClients.expired.length,
            totalRevenue: totalRevenue,
            expiredRevenue: expiredRevenue,
            grandTotalRevenue: grandTotalRevenue,
            activeSearchQuery: activeSearchQuery,
            onActiveSearchChange: setActiveSearchQuery,
            expiredSearchQuery: expiredSearchQuery,
            onExpiredSearchChange: setExpiredSearchQuery,
        };

        switch (activeView) {
            case 'DASHBOARD':
                return <Dashboard {...dashboardProps} />;
            case 'ADD_CLIENT':
                return <AddEditClientView key="add-client" onSave={handleSaveClient} onCancel={() => setActiveView('DASHBOARD')} existingClient={null} />;
            case 'EDIT_CLIENT':
                return <AddEditClientView key={selectedClient?.id} onSave={handleSaveClient} onCancel={() => setActiveView('DASHBOARD')} existingClient={selectedClient} />;
            case 'SETTINGS':
                return <SettingsView owner={owner} onSave={handleSaveOwner} />;
            default:
                return <Dashboard {...dashboardProps} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-4 sm:p-6 lg:p-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-200">The Extreme Gym</h1>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleAddNewClient} className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition-colors font-semibold flex items-center space-x-2">
                            <span>+</span>
                            <span>Add Client</span>
                        </button>
                        <div className="relative" ref={notificationRef}>
                            <button 
                                onClick={() => setNotificationOpen(prev => !prev)}
                                className="relative text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                                aria-label="Notifications"
                            >
                                <BellIcon />
                                {expiringSoonClients.length > 0 && (
                                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
                                )}
                            </button>
                            <NotificationPopover expiringClients={expiringSoonClients} isOpen={isNotificationOpen} />
                        </div>
                    </div>
                </div>
                {renderContent()}
            </main>
            <RenewalModal
                client={selectedClient}
                isOpen={isRenewalModalOpen}
                onClose={handleCloseRenewalModal}
                onRenew={handleRenewPlan}
            />
            <DeleteConfirmationModal
                client={clientToDelete}
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
            />
             {showPersistenceInfo && <PersistenceInfo onDismiss={handleDismissPersistenceInfo} />}
             <WelcomeModal 
                isOpen={showWelcomeModal}
                onContinue={handleContinueWelcome}
                onGoToSettings={handleGoToSettingsFromWelcome}
            />
        </div>
    );
};

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    const navItems = [
        { view: 'DASHBOARD', icon: <DashboardIcon />, label: 'Dashboard' },
        { view: 'SETTINGS', icon: <SettingsIcon />, label: 'Settings' }
    ];

    return (
        <nav className="w-16 md:w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col justify-between">
            <div>
                 <div className="text-white text-2xl font-bold mb-10 hidden md:block">
                    <span className="text-cyan-400">Extreme</span>Gym
                </div>
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.view}>
                            <button
                                onClick={() => setActiveView(item.view as View)}
                                className={`flex items-center space-x-3 w-full p-3 rounded-md transition-colors ${
                                    activeView === item.view
                                        ? 'bg-cyan-500 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span className="hidden md:inline">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default App;