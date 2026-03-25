import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await req.json();
        const { selected_charity_id, charity_percentage } = body;

        if (charity_percentage < 10) {
            return new NextResponse('Minimum charity percentage is 10%', { status: 400 });
        }

        const { error } = await supabase
            .from('profiles')
            .update({ 
                selected_charity_id: selected_charity_id || null, 
                charity_percentage 
            })
            .eq('id', user.id);

        if (error) {
            console.error(error);
            return new NextResponse('Failed to update profile', { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
