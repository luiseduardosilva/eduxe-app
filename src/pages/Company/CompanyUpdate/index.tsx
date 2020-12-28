import React, { useCallback, useEffect, useState } from 'react';
import { message, Form, Input, Button, Card, Col, Row, Select } from 'antd';

import axios from 'axios';
import { api, viacep } from '../../../service/api';

const { Option } = Select;

interface Segmentos {
  id: number;
  nome: string;
}

interface CompanyUpdateProps {
  id: number | null;
  segmentos: Segmentos[]
}



const CompanyUpdate: React.FC<CompanyUpdateProps> = ({ id, segmentos }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    handleGetCompany();
  },[id]);

  const handleFilterSegmento = useCallback((seg: string) => {
      const selected = segmentos.filter(segmento => segmento.nome === seg);
      return selected[0].id ?? 0;
  },[segmentos]);


  const handleGetCompany = useCallback(async() => {
    await api.get(`api/v1/empresas/${id}`)
    .then(result => {
      // handleFilterSegmento(result.data?.data?.segmento);
      form.setFieldsValue({
        segmento: handleFilterSegmento(result.data?.data?.segmento),
        razao_social: result.data?.data?.razao_social,
        nome_fantasia: result.data?.data?.nome_fantasia,
        telefone: result.data?.data?.telefone,
        email: result.data?.data?.email,
        cep: result.data?.data?.cep,
        cidade: result.data?.data?.cidade,
        numero: result.data?.data?.numero,
        logradouro: result.data?.data?.logradouro,
        estado: result.data?.data?.estado,
        bairro: result.data?.data?.bairro,
        complemento: result.data?.data?.complemento,
        inscricao_municipal: result.data?.data?.inscricao_municipal,
        inscricao_estadual: result.data?.data?.inscricao_estadual,
        cnpj: result?.data?.data?.cnpj,
      });
    })
    .catch(() => (message.warning('Ocorreu um erro interno', 3)));
  }
  ,[id]);

  const handleSearchCep = async () => {
    const { cep } = form.getFieldsValue();
    await viacep.get(`${cep}/json/`).then(
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

  const handleSubmit = useCallback(async () => {

    await api.put(`/api/v1/empresas/${id}`, {headers:  {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'}}, form.getFieldsValue())
      .then(result => {
        message.success(result.data.message, 3);
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
  },[form, id]);


  return(
    <>
      <Card title={`Atualizar emrepsa Empresa`} >
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
                <Input type="text" placeholder="CNPJ" />
              </Form.Item>
            </Col>


            <Col span={12} >
              <Form.Item label="Seguimento" name="segmento">
                <Select
                  showSearch
                  placeholder="Selecionae o Seguimento"
                  >
                    { (segmentos).map((vl:any) => {
                    return (<Option key={vl.id} value={vl.id}>{vl.nome}</Option>)
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
              Atualizar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default CompanyUpdate;
