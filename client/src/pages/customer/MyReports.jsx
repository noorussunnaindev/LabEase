import React, { useState, useEffect } from 'react';
import { reportAPI } from '../../api/index.js';
import { FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await reportAPI.getMyReports();
      setReports(res.data.data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Reports</h1>
        <p className="text-gray-600 mt-2">Download your medical test reports</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No reports available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="card flex justify-between items-center">
              <div>
                <h3 className="font-bold">Report for Booking #{report.booking?.bookingNumber}</h3>
                <p className="text-sm text-gray-600">
                  {report.isReady ? 'Ready' : 'Processing'}
                </p>
              </div>
              {report.isReady && report.fileUrl && (
                <a
                  href={report.fileUrl}
                  download
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiDownload size={18} />
                  <span>Download</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
