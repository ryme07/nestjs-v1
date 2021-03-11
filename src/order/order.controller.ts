import { OrderService } from './order.service';
import { Controller, Get, Query, UseGuards, UseInterceptors, ClassSerializerInterceptor, Post, Res } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { OrderItem } from './models/order-item.entity';
import { Order } from './models/order.entity';
import { Parser } from "json2csv";

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller()
export class OrderController {

    constructor(private orderService: OrderService) { }

    @Get('orders')
    async all(@Query('page') page: number = 1) {

        return this.orderService.paginate(page, ['order_items'])
    }

    @Post('export')
    async export(@Res() res: Response) {
        const parser = new Parser({
            fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity']
        });

        const orders = await this.orderService.all(['order_items']);

        const json = [];

        orders.forEach((order: Order) => {
            json.push({
                ID: order.id,
                Name: order.name,
                Email: order.email,
                'Product Title': '',
                Price: '',
                Quantity: ''
            });

            order.order_items.forEach((orderItem: OrderItem) => {
                json.push({
                    ID: '',
                    Name: '',
                    Email: '',
                    'Product Title': orderItem.product_title,
                    Price: orderItem.price,
                    Quantity: orderItem.quantity
                });
            })
        });

        const csv = parser.parse(json);
        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        return res.send(csv);
    }

}
