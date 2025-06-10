import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Board {
    id: string;
    title: string;
}

interface List {
    id: string;
    title: string;
    order: number;
    boardId: string;
}

interface Card { id: string; title: string; description?: string; deadline?: string; priority?: number; listId: string; order: number; }



export default function Dashboard() {
    const navigate = useNavigate();
    const { id: selectedBoardId } = useParams<{ id?: string }>();

    // State: boards + lists
    const [boards, setBoards] = useState<Board[]>([]);
    const [lists, setLists] = useState<List[]>([]);
    const [cardsByList, setCardsByList] = useState<Record<string, Card[]>>({});

    // Loading & error flags
    const [loadingBoards, setLoadingBoards] = useState(false);
    const [errorBoards, setErrorBoards] = useState<string | null>(null);
    const [loadingLists, setLoadingLists] = useState(false);
    const [errorLists, setErrorLists] = useState<string | null>(null);

    // Add-board modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');

    // Delete-board confirmation
    const [deleteBoard, setDeleteBoard] = useState<Board | null>(null);
    const [deleteCard, setDeleteCard] = useState<Card | null>(null);

    const [deleteList, setDeleteList] = useState<List | null>(null);

    const [editBoard, setEditBoard] = useState<Board | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const [newListTitle, setNewListTitle] = useState('');
    const [editList, setEditList] = useState<List | null>(null);
    const [editListTitle, setEditListTitle] = useState('');
    const [showAddListModal, setShowAddListModal] = useState(false);

    const [showAddCardFor, setShowAddCardFor] = useState<string | null>(null);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [editCardDescription, setEditCardDescription] = useState('');
    const [editCard, setEditCard] = useState<Card | null>(null);
    const [editCardTitle, setEditCardTitle] = useState('');

    // Fetch all boards
    useEffect(() => {
        const loadBoards = async () => {
            setLoadingBoards(true);
            try {
                const res = await api.get<Board[]>('/boards');
                setBoards(res.data);
            } catch (e: any) {
                setErrorBoards(e.response?.data?.message || 'Failed to load boards');
            } finally {
                setLoadingBoards(false);
            }
        };
        loadBoards();
    }, []);

    // Fetch lists for the selected board
    useEffect(() => {
        if (!selectedBoardId) return;

        const loadLists = async () => {
            setLoadingLists(true);
            try {
                const res = await api.get<List[]>(`/lists?boardId=${selectedBoardId}`);
                setLists(res.data);
            } catch (e: any) {
                setErrorLists(e.response?.data?.message || 'Failed to load lists');
            } finally {
                setLoadingLists(false);
            }
        };
        loadLists();
    }, [selectedBoardId]);

    // FETCH CARDS for every list
    useEffect(() => {
        if (!lists.length) return;
        lists.forEach((lst) => {
            api.get<Card[]>(`/cards?listId=${lst.id}`)
                .then(r => {
                    setCardsByList(prev => ({ ...prev, [lst.id]: r.data }));
                })
                .catch(() => {
                    // ingoring errors for now
                });
        });
    }, [lists]);

    // ADD CARD
    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showAddCardFor || !newCardTitle.trim()) return;
        try {
            const { data } = await api.post<Card>('/cards', {
                title: newCardTitle,
                listId: showAddCardFor
            });
            setCardsByList(prev => ({
                ...prev,
                [showAddCardFor]: [...(prev[showAddCardFor] || []), data]
            }));
            setShowAddCardFor(null);
            setNewCardTitle('');
        } catch {
            alert('Could not create card');
        }
    };

    // EDIT CARD
    const handleEditCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCard || !editCardTitle.trim()) return;

        try {
            const { data } = await api.patch<Card>(
                `/cards/${editCard.id}`,
                {
                    title: editCardTitle,
                    description: editCardDescription,
                }
            );

            // update local state
            setCardsByList(prev => ({
                ...prev,
                [data.listId]: prev[data.listId].map(c =>
                    c.id === data.id ? data : c
                )
            }));
        } catch {
            alert('Could not rename card');
        } finally {
            setEditCard(null);
            setEditCardTitle('');
            +   setEditCardDescription('');
        }
    };

    // Delete card
    const handleConfirmDeleteCard = async () => {
        if (!deleteCard) return;
        try {
            await api.delete(`/cards/${deleteCard.id}`);
            setCardsByList(prev => ({
                ...prev,
                [deleteCard.listId]: prev[deleteCard.listId].filter(c => c.id !== deleteCard.id),
            }));
        } catch (e: any) {
            alert(e.response?.data?.message || 'Unable to delete card');
        } finally {
            setDeleteCard(null);
        }
    };

    // Add list
    const handleAddList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListTitle.trim() || !selectedBoardId) return;
        try {
            const { data } = await api.post<List>('/lists', {
                title: newListTitle,
                boardId: selectedBoardId,
            });
            setLists(prev => [...prev, data]);
            setShowAddListModal(false);
            setNewListTitle('');
        } catch (e: any) {
            alert(e.response?.data?.message || 'Unable to create list');
        }
    };

    const handleConfirmDeleteList = async () => {
        if (!deleteList) return;
        try {
            await api.delete(`/lists/${deleteList.id}`);
            setLists(prev => prev.filter(l => l.id !== deleteList.id));
            // also drop any cached cards for that list
            setCardsByList(prev => {
                const copy = { ...prev };
                delete copy[deleteList.id];
                return copy;
            });
        } catch (e: any) {
            alert(e.response?.data?.message || 'Unable to delete list');
        } finally {
            setDeleteList(null);
        }
    };

    // Edit list
    const handleEditList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editList || !editListTitle.trim()) return;
        try {
            const { data } = await api.patch<List>(`/lists/${editList.id}`, {
                title: editListTitle,
            });
            setLists(prev => prev.map(l => (l.id === data.id ? data : l)));
            setEditList(null);
            setEditListTitle('');
        } catch (e: any) {
            alert(e.response?.data?.message || 'Unable to rename list');
        }
    };

    // Create a new board
    const handleAddBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBoardTitle.trim()) return;

        try {
            const { data } = await api.post<Board>('/boards', { title: newBoardTitle });
            setBoards((prev) => [...prev, data]);
            navigate(`/dashboard/${data.id}`);
            setShowAddModal(false);
            setNewBoardTitle('');
        } catch (e: any) {
            alert(e.response?.data?.message || 'Unable to create board');
        }
    };

    // Editing Board Name
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editBoard || !editTitle.trim()) return;
        try {
            const { data } = await api.patch<Board>(
                `/boards/${editBoard.id}`,
                { title: editTitle }
            );
            // update locally
            setBoards((prev) =>
                prev.map((b) => (b.id === data.id ? data : b))
            );
            if (data.id === selectedBoardId) {
                // if currently viewing, keep title in sync
            }
            setEditBoard(null);
            setEditTitle('');
        } catch (e: any) {
            alert(e.response?.data?.message || 'Unable to rename board');
        }
    };

    // Delete a board
    const handleConfirmDelete = async () => {
        if (!deleteBoard) return;

        try {
            await api.delete(`/boards/${deleteBoard.id}`);
            setBoards((prev) => prev.filter((b) => b.id !== deleteBoard.id));
            if (deleteBoard.id === selectedBoardId) navigate('/dashboard');
            setDeleteBoard(null);
        } catch (e: any) {
            alert(e.response?.data?.message || 'Unable to delete board');
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-[#001524]  border-r p-4 flex flex-col">
                <Button onClick={() => setShowAddModal(true)} className="mb-4 w-full">
                    Add a New Board
                </Button>

                <div className="flex-1 overflow-auto">
                    {loadingBoards && <p>Loading…</p>}
                    {errorBoards && <p className="text-red-500">{errorBoards}</p>}

                    <div className="space-y-2">
                        {boards.map((b) => (
                            <div
                                key={b.id}
                                className='bg-[#ffecd1] flex items-center justify-between p-2 rounded cursor-pointer'
                            >
                                <Link to={`/dashboard/${b.id}`} className="flex-1">
                                    {b.title}
                                </Link>
                                {/* Edit Icon */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setEditBoard(b);
                                        setEditTitle(b.title);
                                    }}
                                    className="p-1 text-gray-500 hover:text-blue-600"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDeleteBoard(b);
                                    }}
                                    className="p-1 text-gray-500 hover:text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-8 overflow-auto">
                {!selectedBoardId ? (
                    <h1 className="text-center text-3xl font-bold">Select a board</h1>
                ) : (
                    <>
                        <h1 className="mb-6 text-3xl font-bold">
                            {boards.find(b => b.id === selectedBoardId)?.title}
                        </h1>


                        {/* LIST GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {lists.map((lst) => (
                                <div key={lst.id} className="flex flex-col bg-white rounded shadow">
                                    {/* List Title + Edit */}
                                    <div className="px-4 py-2 flex justify-between items-center border-b">
                                        <span className="font-semibold">{lst.title}</span>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => {
                                                    setEditList(lst);
                                                    setEditListTitle(lst.title);
                                                }}
                                                className="p-1 text-gray-500 hover:text-blue-600"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button className=' text-gray-500 hover:text-blue-600'
                                                onClick={() => setDeleteList(lst)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cards in this list */}
                                    <div className="p-4 space-y-2 flex-1 overflow-auto">
                                        {(cardsByList[lst.id] || []).map((card) => (
                                            <div
                                                key={card.id}
                                                className="flex justify-between items-center bg-gray-100 rounded px-3 py-2"
                                            >
                                                <span>{card.title}</span>
                                                <div className='flex gap-3'>
                                                    <button
                                                        onClick={() => {
                                                            setEditCard(card);
                                                            setEditCardTitle(card.title);
                                                            setEditCardDescription(card.description ?? '');
                                                        }}
                                                        className="p-1 text-gray-500 hover:text-blue-600"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        className='text-gray-500 hover:text-blue-600'
                                                        onClick={() => {
                                                            setDeleteCard(card);
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                    </div>


                                    {/* “Add Card” tile */}
                                    <button
                                        onClick={() => setShowAddCardFor(lst.id)}
                                        className="flex items-center justify-center p-2 border-t border-dashed border-gray-300 hover:bg-gray-100"
                                    >
                                        <Plus size={16} className="text-gray-500" />
                                    </button>

                                </div>
                            ))}
                            <button
                                onClick={() => setShowAddListModal(true)}
                                className="flex items-center justify-center p-2 border-t border-dashed border-gray-300 hover:bg-gray-100 rounded"
                            >
                                <Plus size={16} className="text-gray-500" />
                            </button>

                        </div>

                    </>
                )}
            </main>

            {/* Add Board Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <form
                        onSubmit={handleAddBoard}
                        className="bg-white p-6 rounded shadow-lg w-80"
                    >
                        <h2 className="text-xl font-semibold mb-4">New Board</h2>
                        <input
                            autoFocus
                            className="w-full mb-4 px-3 py-2 border rounded"
                            placeholder="Board name"
                            value={newBoardTitle}
                            onChange={(e) => setNewBoardTitle(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteBoard && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-xl font-semibold mb-4">Delete Board?</h2>
                        <p className="mb-4">
                            Are you sure you want to delete <strong>{deleteBoard.title}</strong>?
                        </p>
                        <div className="flex justify-end  space-x-2">
                            <Button
                                onClick={() => setDeleteBoard(null)}
                                variant='secondary'
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                variant='destructive'
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Confirmation Modal */}
            {editBoard && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <form
                        onSubmit={handleEditSubmit}
                        className="bg-white p-6 rounded shadow-lg w-80"
                    >
                        <h2 className="text-xl font-semibold mb-4">Rename Board</h2>
                        <input
                            autoFocus
                            className="w-full mb-4 px-3 py-2 border rounded"
                            placeholder="New board name"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={() => setEditBoard(null)}
                                variant='secondary'
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Add-List Modal */}
            {showAddListModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <form
                        onSubmit={handleAddList}
                        className="bg-white p-6 rounded shadow-lg w-80"
                    >
                        <h2 className="text-xl font-semibold mb-4">New List</h2>
                        <input
                            autoFocus
                            className="w-full mb-4 px-3 py-2 border rounded"
                            placeholder="List name"
                            value={newListTitle}
                            onChange={e => setNewListTitle(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setShowAddListModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit-List Modal */}
            {editList && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <form
                        onSubmit={handleEditList}
                        className="bg-white p-6 rounded shadow-lg w-80"
                    >
                        <h2 className="text-xl font-semibold mb-4">Rename List</h2>
                        <input
                            autoFocus
                            className="w-full mb-4 px-3 py-2 border rounded"
                            placeholder="New list name"
                            value={editListTitle}
                            onChange={e => setEditListTitle(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setEditList(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* ADD CARD MODAL */}
            {showAddCardFor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <form
                        onSubmit={handleAddCard}
                        className="bg-white p-6 rounded shadow-lg w-80"
                    >
                        <h2 className="text-xl font-semibold mb-4">New Card</h2>
                        <input
                            autoFocus
                            className="w-full mb-4 px-3 py-2 border rounded"
                            placeholder="Card title"
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setShowAddCardFor(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* EDIT CARD MODAL */}
            {editCard && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <form
                        onSubmit={handleEditCard}
                        className="bg-white p-6 rounded shadow-lg w-80"
                    >
                        <h2 className="text-xl font-semibold mb-4">Rename Card</h2>
                        <input
                            autoFocus
                            className="w-full mb-4 px-3 py-2 border rounded"
                            placeholder="New card title"
                            value={editCardTitle}
                            onChange={(e) => setEditCardTitle(e.target.value)}
                        />
                        <textarea
                            value={editCardDescription}
                            onChange={e => setEditCardDescription(e.target.value)}
                            placeholder="Description (optional)"
                            rows={3}
                            className="w-full mb-4 px-3 py-2 border rounded resize-y"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setEditCard(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </div>
            )}

            {deleteCard && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-xl font-semibold mb-4">Delete Card?</h2>
                        <p className="mb-4">
                            Are you sure you want to delete <strong>{deleteCard.title}</strong>?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setDeleteCard(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleConfirmDeleteCard}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete-List Confirmation */}
            {deleteList && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-xl font-semibold mb-4">Delete List?</h2>
                        <p className="mb-4">
                            Are you sure you want to delete &ldquo;
                            <strong>{deleteList.title}</strong>&rdquo;?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setDeleteList(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleConfirmDeleteList}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
