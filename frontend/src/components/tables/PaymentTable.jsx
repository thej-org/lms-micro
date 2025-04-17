import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';

const dataSource = [
    {
        courseCode: 'CSC101',
        paymentId: 'PAY-12345',
        amount: 100.0,
    },
    {
        courseCode: 'MATH202',
        paymentId: 'PAY-67890',
        amount: 150.5,
    },
    // Add more payment data objects here
];

const PaymentTable = () => {
    const [isOpen, setIsOpen] = useState(false);
    const columns = [
        {
            title: 'Course Code',
            dataIndex: 'courseCode',
            key: 'courseCode',
            width: '10%',
        },
        {
            title: 'Payment ID',
            dataIndex: 'paymentId',
            key: 'paymentId',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            render: (record) => (
                <>
                    <Button type="primary" onClick={() => setIsOpen(true)}>
                        View
                    </Button>
                    <Modal
                        title="Payment Details"
                        open={isOpen}
                        onCancel={() => setIsOpen(false)}
                        footer={[
                            <Button key="back" onClick={() => setIsOpen(false)}>
                                Close
                            </Button>,
                        ]}
                    >
                        <p>Course Code: {record.courseCode}</p>
                        <p>Payment ID: {record.paymentId}</p>
                        <p>Amount: {record.amount}</p>
                    </Modal>
                </>
            ),
        },
    ];
    return <Table dataSource={dataSource} columns={columns} bordered pagination={false} />;
};

export default PaymentTable;
