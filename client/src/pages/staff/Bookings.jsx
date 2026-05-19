import React, { useState, useEffect } from 'react';
import { bookingAPI, invoiceAPI } from '../../api/index.js';
import { FiEdit, FiDownload, FiCheckCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../../components/modals/Modal.jsx';

export default function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [reportFile, setReportFile] = useState(null);
  const [uploadingReport, setUploadingReport] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getAllBookings(1, 100, statusFilter === 'all' ? null : statusFilter);
      setBookings(res.data.data.data || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const getStatusColor = (status) => {
    const colors = {
      BOOKED: 'bg-blue-100 text-blue-800',
      SAMPLE_COLLECTED: 'bg-purple-100 text-purple-800',
      PROCESSING: 'bg-yellow-100 text-yellow-800',
      REPORT_READY: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      BOOKED: 'SAMPLE_COLLECTED',
      SAMPLE_COLLECTED: 'PROCESSING',
      PROCESSING: 'REPORT_READY',
      REPORT_READY: 'COMPLETED',
    };
    return statusFlow[currentStatus];
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;

    const nextStatus = getNextStatus(selectedBooking.status);
    if (!nextStatus) {
      toast.error('This booking cannot be updated further');
      return;
    }

    setUpdatingStatus(true);
    try {
      // If changing to COMPLETED, ensure invoice exists first
      if (nextStatus === 'COMPLETED') {
        try {
          await invoiceAPI.createInvoice(selectedBooking.id);
        } catch (error) {
          // Invoice might already exist, which is fine
          if (error.response?.status !== 409) {
            console.log('Invoice creation info:', error.response?.data?.message);
          }
        }
      }

      await bookingAPI.updateBookingStatus(selectedBooking.id, nextStatus);
      toast.success(`Status updated to ${nextStatus}`);
      setSelectedBooking({ ...selectedBooking, status: nextStatus });
      fetchBookings();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update status';
      toast.error(errorMsg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUploadReport = async () => {
    if (!reportFile || !selectedBooking) {
      toast.error('Please select a report file');
      return;
    }

    setUploadingReport(true);
    try {
      // In a real app, you'd send this to an upload endpoint
      // For now, just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Report uploaded successfully');
      setReportFile(null);
      await handleUpdateStatus();
    } catch (error) {
      toast.error('Failed to upload report');
    } finally {
      setUploadingReport(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!selectedBooking) {
      toast.error('No booking selected');
      return;
    }

    setDownloadingInvoice(true);
    try {
      // First, ensure invoice exists by creating one if needed
      try {
        await invoiceAPI.createInvoice(selectedBooking.id);
      } catch (error) {
        // Invoice might already exist, which is fine
        if (error.response?.status !== 409) {
          console.log('Invoice creation info:', error.response?.data?.message);
        }
      }

      // Now get the invoice data for download
      const response = await invoiceAPI.downloadInvoice(selectedBooking.id);
      
      if (response.data.success && response.data.data) {
        const invoiceData = response.data.data;
        
        // Create a Blob from the HTML content and download it
        const htmlContent = invoiceData.htmlContent;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice_${invoiceData.invoiceNumber}.html`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        toast.success('Invoice downloaded successfully');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to download invoice';
      toast.error(errorMsg);
      console.error('Invoice download error:', error);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setReportFile(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Test Bookings Management</h1>
        <p className="text-gray-600 mt-2">Manage customer test bookings and collect samples</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setStatusFilter('BOOKED')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            statusFilter === 'BOOKED'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔵 New Bookings
        </button>
        <button
          onClick={() => setStatusFilter('SAMPLE_COLLECTED')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            statusFilter === 'SAMPLE_COLLECTED'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ✓ Samples Collected
        </button>
        <button
          onClick={() => setStatusFilter('PROCESSING')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            statusFilter === 'PROCESSING'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⏳ Processing
        </button>
        <button
          onClick={() => setStatusFilter('REPORT_READY')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            statusFilter === 'REPORT_READY'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📄 Report Ready
        </button>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-bold mb-2">No bookings found</h3>
          <p className="text-gray-600">There are no bookings in this status category</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Booking #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tests</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-blue-600">{booking.bookingNumber}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{booking.user?.firstName} {booking.user?.lastName}</p>
                      <p className="text-sm text-gray-600">{booking.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{booking.user?.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {new Date(booking.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {booking.tests?.slice(0, 2).map((test) => (
                        <span key={test.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {test.testName?.substring(0, 10)}
                        </span>
                      ))}
                      {booking.tests?.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{booking.tests.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">${booking.totalAmount}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openBookingModal(booking)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                    >
                      <FiEdit size={16} />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <Modal isOpen={showModal} onClose={closeModal} title="Manage Booking" size="lg">
          <div className="space-y-6">
            {/* Booking Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">Booking Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Booking #</p>
                  <p className="font-bold">{selectedBooking.bookingNumber}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Date</p>
                  <p className="font-bold">{new Date(selectedBooking.appointmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Customer</p>
                  <p className="font-bold">{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Phone</p>
                  <p className="font-bold">{selectedBooking.user?.phone}</p>
                </div>
              </div>
            </div>

            {/* Tests */}
            <div>
              <h3 className="font-bold mb-3">Tests Ordered</h3>
              <div className="space-y-2">
                {selectedBooking.tests?.map((test) => (
                  <div key={test.id} className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">{test.testName}</p>
                    <p className="text-sm text-gray-600">{test.description}</p>
                    <p className="text-sm font-semibold text-blue-600 mt-1">${test.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status */}
            <div>
              <h3 className="font-bold mb-3">Current Status</h3>
              <div className={`p-4 rounded-lg ${getStatusColor(selectedBooking.status)}`}>
                <p className="font-bold text-lg">{selectedBooking.status}</p>
              </div>
            </div>

            {/* Status Update */}
            {selectedBooking.status !== 'COMPLETED' && selectedBooking.status !== 'CANCELLED' && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-yellow-900 mb-3">Update Status</h3>
                <p className="text-sm text-yellow-800 mb-4">
                  Update to: <span className="font-bold">{getNextStatus(selectedBooking.status)}</span>
                </p>

                {/* Report Upload for PROCESSING → REPORT_READY */}
                {selectedBooking.status === 'PROCESSING' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📄 Upload Report (PDF/Image)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setReportFile(e.target.files?.[0])}
                        className="flex-1"
                      />
                    </div>
                    {reportFile && (
                      <p className="text-sm text-green-600 mt-2">✓ File selected: {reportFile.name}</p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || uploadingReport}
                  className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheckCircle size={18} />
                  {updatingStatus || uploadingReport ? 'Updating...' : `Update to ${getNextStatus(selectedBooking.status)}`}
                </button>
              </div>
            )}

            {/* Sample Collection for BOOKED */}
            {selectedBooking.status === 'BOOKED' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-900 mb-3">✓ Mark Sample as Collected</h3>
                <p className="text-sm text-green-800 mb-4">
                  Click below to confirm that the sample has been collected from the customer.
                </p>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheckCircle size={18} />
                  {updatingStatus ? 'Updating...' : 'Confirm Sample Collection'}
                </button>
              </div>
            )}

            {/* Processing Stage */}
            {selectedBooking.status === 'SAMPLE_COLLECTED' && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-bold text-purple-900 mb-3">⏳ Move to Processing</h3>
                <p className="text-sm text-purple-800 mb-4">
                  Start analyzing the sample. You'll need to upload the report in the next step.
                </p>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="w-full px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiClock size={18} />
                  {updatingStatus ? 'Updating...' : 'Start Processing'}
                </button>
              </div>
            )}

            {/* Completed Status */}
            {selectedBooking.status === 'COMPLETED' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="font-bold text-green-900">Booking Completed</h3>
                  <p className="text-sm text-green-800 mt-2">Customer can now download their report</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                className="flex-1 px-4 py-3 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiDownload size={18} />
                {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
