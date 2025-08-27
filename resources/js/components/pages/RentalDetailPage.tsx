import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '@/services/api';
import { Rental } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const RentalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRental = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const resp = await apiService.getRental(Number(id));
        if (resp.success && resp.data) {
          setRental(resp.data);
        } else {
          setError(resp.message || 'Rental not found');
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to fetch rental');
      } finally {
        setLoading(false);
      }
    };

    fetchRental();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-4xl mx-auto p-6"> <div className="text-red-600">{error}</div> </div>;
  if (!rental) return <div className="max-w-4xl mx-auto p-6"> <div>No rental data</div> </div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Rental #{rental.id}</h1>
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-medium">Room</h2>
            <p className="text-sm text-gray-700">{rental.room?.room_number ?? '—'}</p>
            <p className="text-sm text-gray-600">{rental.room?.kostan?.name ?? '—'}</p>
            <p className="text-sm text-gray-600">{rental.room?.kostan?.address ?? ''}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium">Tenant</h2>
            <p className="text-sm text-gray-700">{rental.tenant?.name ?? '—'}</p>
            <p className="text-sm text-gray-600">{rental.tenant?.email ?? ''}</p>
            <p className="text-sm text-gray-600">{rental.tenant?.phone ?? ''}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Status</h3>
            <p className="mt-1">{rental.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Start Date</h3>
            <p className="mt-1">{new Date(rental.start_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">End Date</h3>
            <p className="mt-1">{new Date(rental.end_date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500">Notes</h3>
          <p className="mt-1 text-sm text-gray-700">{rental.notes ?? '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailPage;
