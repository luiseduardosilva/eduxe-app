import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Table, Tag, Popconfirm, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { api } from '../../../service/api';
import CompanyUpdate from '../CompanyUpdate';


interface Segmentos {
  id: number;
  nome: string;
}

const CompanyList: React.FC = () =>{

  const [companies, setCompanies] = useState([]);
  const [visible, setVisible] = useState(false);
  const [idUpdate, setIdUpdate] = useState< number | null>(null);
  const [segmentos, setSegmentos] = useState<[] | Segmentos[]>([])

  async function confirm(id: any) {
    await api.delete(`/api/v1/empresas/${id}`).then(result => {
      message.success('Empresa removida com sucesso!')
      handleGetCompanies();
    }).catch(() => message.warning('Ocorreu um erro interno', 3));
  }

  useEffect(() =>{
    handleGetSegmentos();
  },[]);

  const handleGetSegmentos = useCallback( async () => {
    await api.get('/api/v1/segmentos').then(result => {
      setSegmentos(result.data.data);
    }).catch(() => {
      message.warning('Error ao consultar Segmentos', 3)
    });
  },[segmentos])

  const columns = [
    {
      title: "#ID",
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: "CNPJ",
      dataIndex: 'cnpj',
      key: 'cnpj',
    },
    {
      title: "Razao Social",
      dataIndex: 'razao_social',
      key: 'razao_social',
    },
    {
      title: "Ações",
      dataIndex: 'id',
      key: 'id',
      render: (id: number, row: any) => (
      <>
          <Tag color="orange"onClick={() => { setVisible(true); setIdUpdate(id)}} >
            <EditOutlined  />
          </Tag>
          <Popconfirm
            title="Deseja realmente deletar esse dado?"
            onConfirm={() => {confirm(id)}}
            okText="Sim"
            cancelText="Não"
            >

            <Tag color="red">
              <DeleteOutlined />
            </Tag>
          </Popconfirm>

        </>
        )
    },
  ];

  useEffect(() => {
    handleGetCompanies();
  },[]);


  const handleGetCompanies = async () => {
    await api.get('/api/v1/empresas').then(result => {
      setCompanies(result.data.data);
    }).catch(() => message.warning('Ocorreu um erro interno', 3));
  }


  return (
    <>
    <Modal
          title="Atualizar Empresa"
          visible={visible}
          destroyOnClose={true}
          footer={null}
          onCancel={() => {setVisible(false); handleGetCompanies();} }
          width={1000}

        >
          <CompanyUpdate id={idUpdate} segmentos={segmentos} />
      </Modal>
      <Table columns={columns} dataSource={companies} />
    </>
  );
}
export default CompanyList;
