import React, { useCallback, useEffect, useState } from 'react';
import { message, Form, Input, Button, Card, Col, Row, Select } from 'antd';

import { api, receitaws, viacep } from '../../../service/api';
import Axios from 'axios';

const { Option } = Select;

interface Segmentos {
  id: number;
  nome: string;
}

const CompanyCreate: React.FC = () =>{

  const [form] = Form.useForm();
  const [segmentos, setSegmentos] = useState<[] | Segmentos[]>([])


  useEffect(() =>{
    handleGetSegmentos();
  },[]);

  const handleGetSegmentos = async () => {
    await api.get('/api/v1/segmentos').then(result => {
      setSegmentos(result.data.data);
    }).catch(() => {
      message.warning('Error ao consultar Segmentos', 3)
    });
  }

  const handleSearchCep = async () => {
    const { cep } = form.getFieldsValue();
    await viacep.get(`/${cep}/json/`).then(
      result => {
        if(!result.data.cep){
          message.warning('Error ao localizar CEP', 3)
        }

        if(result.data.cep){
          form.setFieldsValue({
            cep: result.data.cep,
            estado: result.data.uf,
            logradouro: result.data.logradouro,
            cidade: result.data.localidade,
            bairro : result.data.bairro,
           });
          message.success('Consulta de CEP realizada!', 3);
        }
      }
    ).catch(() => {
      message.warning('Error ao localizar CEP', 3)
    });
  }

  const handleSearchCnpj = async () => {
    let { cnpj } = form.getFieldsValue();
    if(cnpj){
      cnpj = cnpj.match(/\d+/g).join('');
      await receitaws.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`).then(
        result => {
          console.log(result.data);
        }
      ).catch(() => {
        message.warning('Error ao localizar CNPJ', 3)
      });
    }
  }

  const handleSubmit = useCallback(async () => {

    await api.post('/api/v1/empresas', form.getFieldsValue())
      .then(result => {
        message.success(result.data.message, 3);
        form.resetFields();
      })
      .catch(err => {
        if(err.response.data.error){
          const errors = err.response.data.error;

          Object.keys(errors).forEach((campo) => {
            (errors[campo]).map((msg: string) => {
              message.warning(msg, 5)
            })
          });
        }
      }
    );
  },[form]);


  return(
    <>
      <Card title="Cadastrar Empresa" >
        <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            name="company_form"
          >

          <Row gutter={[16, 16]}>

            <Col span={12} >
              <Form.Item
                label="Nome Fantasia"
                name="nome_fantasia"
                rules={[{ required: true, message: 'Digite um nome' }]}
              >
                <Input type="text" placeholder="Nome" />
              </Form.Item>
            </Col>

            <Col span={12} >
              <Form.Item
                label="Razão Social"
                name="razao_social"
                rules={[{ required: true, message: 'Digite um nome' }]}
              >
                <Input type="text" placeholder="Nome" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="E-mail"
                name="email"
                rules={[{ required: true, message: 'Digite um email', type: "email" }]}
              >
                <Input type="email" placeholder="contato@eduxe.com.br" />
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item
                label="Telefone"
                name="telefone"
                rules={[{ required: true, message: 'Digite um telefone', }]}
              >
                <Input type="text" placeholder="Ex (83) 999999999" />
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item
                label="CNPJ"
                name="cnpj"
                rules={[{ required: true, message: 'Digite um CNPJ' }]}
                >
                <Input type="text" placeholder="CNPJ" onBlur={handleSearchCnpj} />
              </Form.Item>
            </Col>


            <Col span={12} >
              <Form.Item label="Seguimento" name="segmento">
                <Select
                  showSearch
                  placeholder="Selecionae o Seguimento"
                  >
                    { Object.keys(segmentos).map((vl:any) => {
                    return (<Option key={segmentos[vl].id} value={segmentos[vl].id}>{segmentos[vl].nome}</Option>)
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Inscrição Municipal"
                name="inscricao_municipal"
                rules={[{ required: true, message: 'Digite a inscrição  municipal' }]}
                >
                <Input type="text" placeholder="Inscrição Municipal" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Inscrição Estadual"
                name="inscricao_estadual"
                >
                <Input type="text" placeholder="Inscrição Estadual" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="CEP"
                name="cep"
                rules={[{ required: true, message: 'Digite um CEP' }]}
              >
                <Input type="text" placeholder="CEP" onBlur={handleSearchCep} />
              </Form.Item>

            </Col>

            <Col span={4}>
            <Form.Item
              label="UF"
              name="estado"
              rules={[{ required: true, message: 'Digite uma UF' }]}
            >
              <Input type="text" placeholder="UF" />
            </Form.Item>

            </Col>

            <Col span={7}>
              <Form.Item
                label="Cidade"
                name="cidade"
                rules={[{ required: true, message: 'Digite uma Cidade' }]}
              >
                <Input type="text" placeholder="Cidade" />
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item
                label="Bairro"
                name="bairro"
                rules={[{ required: true, message: 'Digite um Bairro' }]}
              >
                <Input type="text" placeholder="Bairro" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Rua"
                name="logradouro"
                rules={[{ required: true, message: 'Digite um Logradouro' }]}
              >
                <Input type="text" placeholder="Rua" />
              </Form.Item>
            </Col>


            <Col span={3}>
              <Form.Item
                label="Numero"
                name="numero"
                rules={[{ required: true, message: 'Digite um Número' }]}
              >
                <Input type="text" placeholder="Numero" />
              </Form.Item>
            </Col>


            <Col span={9}>
              <Form.Item
                label="Complemento"
                name="complemento"
              >
                <Input type="text" placeholder="Complemento" />
              </Form.Item>

            </Col>
          </Row>
          <Form.Item>
            <Button  type="primary" htmlType="submit" className="login-form-button" >
              Cadastrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
export default CompanyCreate;
