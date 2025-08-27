import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Kostan, Room } from '@/types';
import apiService from '@/services/api';
import { 
  MapPinIcon, 
  StarIcon, 
  BuildingOfficeIcon,
  WifiIcon,
  TruckIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  UserIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import ImageWithFallback from '@/components/common/ImageWithFallback';

const KostanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [kostan, setKostan] = useState<Kostan | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState<string>('all');

  useEffect(() => {
    if (id) {
      fetchKostan();
      fetchRooms();
    }
  }, [id]);

  const fetchKostan = async () => {
    try {
      setLoading(true);
      const response = await apiService.getKostan(parseInt(id!));
      
      if (response.success && response.data) {
        setKostan(response.data);
      } else {
        setError(response.message || 'Failed to fetch kostan details');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching kostan details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      const response = await apiService.getRooms(parseInt(id!));
      
      if (response.success && response.data) {
        setRooms(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
    } finally {
      setRoomsLoading(false);
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'wifi':
      case 'wi-fi':
        return <WifiIcon className="h-5 w-5" />;
      case 'parking':
      case 'parkir':
        return <TruckIcon className="h-5 w-5" />;
      case 'laundry':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'security':
      case 'keamanan':
        return <ShieldCheckIcon className="h-5 w-5" />;
      default:
        return <BuildingOfficeIcon className="h-5 w-5" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Safely format rating values which may come as number, string or null
  const formatRating = (rating: unknown) => {
    const num = typeof rating === 'number' ? rating : (rating ? Number(rating) : NaN);
    return Number.isFinite(num) ? num.toFixed(1) : '0.0';
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'single':
        return 'bg-purple-100 text-purple-800';
      case 'shared':
        return 'bg-blue-100 text-blue-800';
      case 'studio':
        return 'bg-green-100 text-green-800';
      case 'apartment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRooms = selectedRoomType === 'all' 
    ? rooms 
    : rooms.filter(room => room.room_type === selectedRoomType);

  const roomTypes = [...new Set(rooms.map(room => room.room_type))];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !kostan) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Kostan not found'}</p>
          <Link to="/kostans" className="text-red-600 hover:text-red-500 underline mt-2 inline-block">
            {t('button.back')} {t('nav.kostans')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/kostans" className="text-gray-500 hover:text-gray-700">
              {t('nav.kostans')}
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-medium">{kostan.name}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            {kostan.images && kostan.images.length > 0 ? (
              <ImageWithFallback
                src={kostan.images[selectedImage]}
                alt={kostan.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageWithFallback
                src={undefined}
                alt={kostan.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {kostan.images && kostan.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {kostan.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 rounded-md overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${kostan.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Kostan Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{kostan.name}</h1>
              <div className="flex items-center bg-yellow-50 rounded-full px-3 py-1">
                <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-medium">{formatRating(kostan.average_rating)}</span>
                <span className="text-gray-500 ml-1">({kostan.total_reviews} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{kostan.address}, {kostan.city}, {kostan.province}</span>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              {kostan.description}
            </p>
          </div>

          {/* Owner Info */}
          {kostan.owner && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('kostans.owner')}
              </h3>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{kostan.owner.name}</p>
                  <p className="text-sm text-gray-600">{kostan.owner.phone || kostan.owner.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Facilities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('kostans.facilities')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {kostan.facilities?.map((facility, index) => (
                <div key={index} className="flex items-center">
                  {getFacilityIcon(facility)}
                  <span className="ml-2 text-gray-700 capitalize">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          {kostan.rules && kostan.rules.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('kostans.rules')}
              </h3>
              <ul className="space-y-1">
                {kostan.rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Rooms Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('kostans.availableRooms')} ({kostan.total_rooms} {t('kostans.rooms')})
          </h2>
          
          {/* Room Type Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedRoomType('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedRoomType === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('all')}
            </button>
            {roomTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedRoomType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  selectedRoomType === type
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {roomsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-8">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('rooms.empty.title')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('rooms.empty.description')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div key={room.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-gray-200 rounded mb-3 overflow-hidden">
                  {room.images && room.images.length > 0 ? (
                    <ImageWithFallback
                      src={room.images[0]}
                      alt={`Room ${room.room_number}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageWithFallback
                      src={undefined}
                      alt={`Room ${room.room_number}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.room_type)}`}>
                      {room.room_type}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">
                      {t('room')} {room.room_number}
                    </h3>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(room.monthly_price)}
                      </p>
                      <p className="text-xs text-gray-500">{t('per')} {t('month')}</p>
                    </div>
                  </div>
                  
                  {room.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {room.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span>{room.current_occupancy}/{room.max_occupancy}</span>
                    </div>
                    {room.size && (
                      <div className="flex items-center">
                        <span>{room.size}m²</span>
                      </div>
                    )}
                    {room.floor && (
                      <div className="flex items-center">
                        <span>{t('floor')} {room.floor}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Room facilities */}
                  {room.facilities && room.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.facilities.slice(0, 3).map((facility, index) => (
                        <span key={index} className="bg-white rounded-full px-2 py-1 text-xs text-gray-600 capitalize">
                          {facility}
                        </span>
                      ))}
                      {room.facilities.length > 3 && (
                        <span className="bg-white rounded-full px-2 py-1 text-xs text-gray-600">
                          +{room.facilities.length - 3} {t('more')}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Action Button */}
                  {user?.role === 'tenant' && room.status === 'available' && (
                    <Link
                      to={`/rooms/${room.id}/apply`}
                      className="w-full mt-3 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors inline-block"
                    >
                      {t('rooms.apply')}
                    </Link>
                  )}
                  
                  {room.status !== 'available' && (
                    <div className="w-full mt-3 bg-gray-300 text-gray-500 text-center py-2 px-4 rounded-md text-sm font-medium">
                      {room.status === 'occupied' ? t('rooms.occupied') : 
                       room.status === 'maintenance' ? t('rooms.maintenance') : 
                       t('rooms.reserved')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      {kostan.published_reviews && kostan.published_reviews.length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('kostans.reviews')} ({kostan.total_reviews})
          </h2>
          
          <div className="space-y-4">
            {kostan.published_reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.tenant?.name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 ml-11">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
          
          {kostan.total_reviews > 5 && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-500 font-medium">
                {t('reviews.showMore')} ({kostan.total_reviews - 5} {t('more')})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KostanDetailPage;
