import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Modal, Select } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from '../../pages/ProfilePage/style'
import { getBase64 } from '../../utils'
import * as ProductService from '../../services/ProductService'
import * as CategoryService from '../../services/CategoryService'
import { useMutationHooks } from '../../hooks/userMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'

const AdminProduct = () => {
  const [madalform] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const user = useSelector((state) => state?.user);

  const [stateProducts, setStateProducts] = useState({
    product_name: '',
    category_id: '',
    category_name: '',
    quantity: '',
    price: '',
    rating: '',
    description: '',
    discount: '',
    image: ''
  });

  const [stateProductsDetails, setStateProductsDetails] = useState({
    product_name: '',
    category_id: '',
    category_name: '',
    quantity: '',
    price: '',
    rating: '',
    description: '',
    discount: '',
    image: ''
  });

  const mutation = useMutationHooks(
    (data) => { 
      const { 
        product_name,
        category_id,
        category_name,
        quantity,
        price,
        rating,
        description,
        discount,
        image } = data;

      const resProduct = ProductService.createProduct({
        product_name,
        category_id,
        category_name,
        quantity,
        price,
        rating,
        description,
        discount,
        image
      });

      return resProduct;
    }
  );

  const mutationUpdate = useMutationHooks(
    (data) => { 
      const { id, token, ...rests } = data;

      const resProduct = ProductService.updateProduct(id, token, rests.stateProductsDetails);

      return resProduct;
    }
  );

  const { Option } = Select;
  const fetchCategoryAll = async () => {
    const resCatetogry = await CategoryService.getAllCategory();
    return resCatetogry;
  }
  
  const { data, isSuccess, isError, isPending } = mutation;
  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate;

  const { isLoading, data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoryAll,
    retry: 3,
    retryDelay: 1000,
  });

  const getAllProducts = async () => {
    const resAllProduct = await ProductService.getAllProduct();
    return resAllProduct;
  }

  const { isLoading: isLoadingProduct, data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if(isSuccess && data?.message === 'Success') {
      message.success("Tạo sản phẩm thành công");
      handleCancel();
    }
    else if (isError) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccess])

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.message === 'Success') {
      message.success("Cập nhật sản phẩm thành công");
      handleCloseDrawer();
    }
    else if (isErrorUpdated) {
      message.error("Có gì đó sai sai");
    }
  }, [isSuccessUpdated])

  const fetchGetDetailsProduct = async (rowSelected) => {
    const resProductsDetails = await ProductService.getDetailsProduct(rowSelected);

    if (resProductsDetails?.data) {
      setStateProductsDetails({
        product_name: resProductsDetails?.data.product_name,
        category_id: resProductsDetails?.data.category_id,
        category_name: resProductsDetails?.data.category_name,
        quantity: resProductsDetails?.data.quantity,
        price: resProductsDetails?.data.price,
        rating: resProductsDetails?.data.rating,
        description: resProductsDetails?.data.description,
        discount: resProductsDetails?.data.discount,
        image: resProductsDetails?.data.image,
      })
    }

    setIsLoadingUpdate(false);
  }
  const [drawerForm] = Form.useForm();
  useEffect(() => {
    const formValues = {
      product_name: stateProductsDetails.product_name,
      category_id: stateProductsDetails.category_id,
      quantity: stateProductsDetails.quantity,
      price: stateProductsDetails.price,
      rating: stateProductsDetails.rating,
      description: stateProductsDetails.description,
      discount: stateProductsDetails.discount,
      image: stateProductsDetails.image,
    };

    drawerForm.setFieldsValue(formValues);
  }, [stateProductsDetails, drawerForm]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected])
  
  const handleDetailsProduct = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }

    setIsOpenDrawer(true);
  }

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}}/>
        <EditOutlined style={{color: 'orange', fontSize: '30px', cursor: 'pointer'}} onClick={handleDetailsProduct}/>
      </div>
    )
  }
  
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product_name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
    },
    {
      title: 'Số lượng trong kho',
      dataIndex: 'quantity',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];

  const dataTable = products?.data.map((product) => {
    return {
      ...product, 
      key: product.product_id
    }
  });
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProducts({
      product_name: '',
      category_id: '',
      category_name: '',
      quantity: '',
      price: '',
      rating: '',
      description: '',
      discount: '',
      image: ''
    });

    madalform.resetFields();
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductsDetails({
      product_name: '',
      category_id: '',
      category_name: '',
      quantity: '',
      price: '',
      rating: '',
      description: '',
      discount: '',
      image: ''
    });

    drawerForm.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateProducts);
  }

  const handleOnChange = (e) => {
    setStateProducts({
      ...stateProducts,
      [e.target.name]: e.target.value
    });
  }

  const handleOnChangeDetails = (e) => {
    setStateProductsDetails({
      ...stateProductsDetails,
      [e.target.name]: e.target.value
    });
  }

  const handleOnChangeAvatar = async ({fileList}) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProducts({
      ...stateProducts,
      image: file.preview
    })
  }

  const handleOnChangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProductsDetails({
      ...stateProductsDetails,
      image: file.preview
    })
  }

  const handleKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
  
    // Cho phép các phím số, phím mũi tên lên, xuống, và phím xóa
    if ((charCode < 48 || charCode > 57) && charCode !== 8 && charCode !== 38 && charCode !== 40) {
      e.preventDefault();
    }
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, stateProductsDetails})
  }

  return (
    <div>
        <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
        <div style={{ marginTop: '10px'}}>
          <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }}/></Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <TableComponent columns={columns} data={dataTable} isLoading={isLoadingProduct} 
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  if (record.id) {
                    setRowSelected(record.id);
                  }
                },
              };
            }}
          ></TableComponent>
        </div>
        <Modal title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <Loading isLoading={isPending}>
            <Form
              name="modalForm"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 700 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="on"
              form={madalform}
            >
              <Form.Item
                label="Tên sản phẩm"
                name="product_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <InputComponent value={ stateProducts.product_name } onChange={handleOnChange} name="product_name"/>
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  loading={isLoading}
                  value={stateProducts.category_id}
                  onChange={(value) => {
                    const selectedCategory = categories.data.find(category => category.id === value);
              
                    // Thay đổi ở đây: cập nhật trực tiếp category_id và category_name trong state
                    setStateProducts({
                      ...stateProducts,
                      category_id: value || '',
                      category_name: selectedCategory ? selectedCategory.category_name || '' : '',
                    });
                  }}
                >
                  {Array.isArray(categories?.data) && categories.data.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.category_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Số lượng trong kho"
                name="quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng trong kho!' }]}
              >
                <InputComponent type="number" value={ stateProducts.quantity } onChange={handleOnChange} name="quantity" onKeyDown={handleKeyPress}/>
              </Form.Item>

              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={ stateProducts.price } onChange={handleOnChange} name="price"/>
              </Form.Item>

              <Form.Item
                label="Điểm đánh giá"
                name="rating"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đánh giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={ stateProducts.rating } onChange={handleOnChange} name="rating"/>
              </Form.Item>

              <Form.Item
                label="Giảm giá"
                name="discount"
                rules={[{ required: true, message: 'Vui lòng nhập giảm giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={ stateProducts.discount } onChange={handleOnChange} name="discount"/>
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
              >
                <InputComponent value={ stateProducts.description } onChange={handleOnChange} name="description"/>
              </Form.Item>

              <Form.Item
                label="Hình ảnh sản phẩm"
                name="image"
                rules={[{ required: true, message: 'Vui lòng chọn ảnh sản phẩm!' }]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                  <Button>Select File</Button>
                  {stateProducts?.image && (
                    <img src={stateProducts?.image} style={{height: '250px',  width: '250px', borderRadius: '50%', objectFit: 'cover'}} alt='avatar'/>
                  )}
                </WrapperUploadFile>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                <Button type="primary" htmlType="submit">Tạo sản phẩm</Button>
              </Form.Item>
            </Form>
          </Loading>
        </Modal>
        <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="30%">
          <Loading isLoading={isLoadingUpdate}>
            <Form
              name="drawerForm"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 700 }}
              initialValues={{ remember: true }}
              onFinish={onUpdateProduct}
              autoComplete="on"
              form={drawerForm}
            >
              <Form.Item
                label="Tên sản phẩm"
                name="product_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <InputComponent value={stateProductsDetails.product_name} onChange={handleOnChangeDetails} name="product_name"/>
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category_id"
                rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  loading={isLoading}
                  value={stateProductsDetails?.category_id}
                  onChange={(value) => {
                    const selectedCategory = categories.data.find(category => category.id === value);
              
                    // Thay đổi ở đây: cập nhật trực tiếp category_id và category_name trong state
                    setStateProducts({
                      ...stateProductsDetails,
                      category_id: value || '',
                      category_name: selectedCategory ? selectedCategory.category_name || '' : '',
                    });
                  }}
                >
                  {Array.isArray(categories?.data) && categories.data.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.category_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Số lượng trong kho"
                name="quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng trong kho!' }]}
              >
                <InputComponent type="number" value={stateProductsDetails.quantity} onChange={handleOnChangeDetails} name="quantity"/>
              </Form.Item>

              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={stateProductsDetails?.price} onChange={handleOnChangeDetails} name="price"/>
              </Form.Item>

              <Form.Item
                label="Điểm đánh giá"
                name="rating"
                rules={[{ required: true, message: 'Vui lòng nhập điểm đánh giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={stateProductsDetails?.rating} onChange={handleOnChangeDetails} name="rating"/>
              </Form.Item>

              <Form.Item
                label="Giảm giá"
                name="discount"
                rules={[{ required: true, message: 'Vui lòng nhập giảm giá sản phẩm!' }]}
              >
                <InputComponent type="number" value={stateProductsDetails?.discount} onChange={handleOnChangeDetails} name="discount"/>
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
              >
                <InputComponent value={stateProductsDetails?.description} onChange={handleOnChangeDetails} name="description"/>
              </Form.Item>

              <Form.Item
                label="Hình ảnh sản phẩm"
                name="image"
                rules={[{ required: true, message: 'Vui lòng chọn ảnh sản phẩm!' }]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                  <Button>Select File</Button>
                  {stateProductsDetails?.image && (
                    <img src={stateProductsDetails?.image} style={{height: '250px',  width: '250px', borderRadius: '50%', objectFit: 'cover'}} alt='avatar'/>
                  )}
                </WrapperUploadFile>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                <Button type="primary" htmlType="submit">Cập nhật sản phẩm</Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>
    </div>
  )
}

export default AdminProduct